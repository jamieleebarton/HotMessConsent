import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import SignaturePad from '../components/SignaturePad';
import { Clause, defaultBody, randomClause, roastClauses, Taglines } from '../data/clauses';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { createAndShareAgreementPDF } from '../utils/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'Agreement'>;

export default function AgreementScreen({ route, navigation }: Props) {
  const { scenario } = route.params;
  const [includeDeluxe, setIncludeDeluxe] = useState(false);
  const [wheelClauses, setWheelClauses] = useState<Clause[]>([]);
  const [sigA, setSigA] = useState<string | null>(null);
  const [sigB, setSigB] = useState<string | null>(null);
  const [nameA, setNameA] = useState('');
  const [nameB, setNameB] = useState('');
  const [initialsA, setInitialsA] = useState('');
  const [initialsB, setInitialsB] = useState('');
  const [adoptA, setAdoptA] = useState(false);
  const [adoptB, setAdoptB] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const body = useMemo(() => defaultBody(scenario, includeDeluxe, wheelClauses), [scenario, includeDeluxe, wheelClauses]);

  // Generate local IDs for the on-screen parody doc header
  const [envelopeId] = useState(() => `HM-${randBlock()}-${randBlock()}-${randBlock()}`);
  const [documentId] = useState(() => `DOC-${randBlock()}`);
  const [styleMode, setStyleMode] = useState<'serious' | 'meme'>('serious');
  const [tagline] = useState(() => Taglines[Math.floor(Math.random() * Taglines.length)]);
  const docRef = React.useRef<any>(null);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ViewShot ref={docRef} options={{ format: 'png', quality: 1 }} style={{ borderRadius: 10 }}>
        <View style={[styles.docWrap, styleMode === 'meme' && { backgroundColor: '#fff0f5', borderColor: '#ffd1e6' }]}>
          <View style={styles.docHeader}>
            <Text style={styles.docBrand}>HotMessSign eSignature — Totally Not DocuSign</Text>
            <Text style={styles.docMeta}>Envelope ID: {envelopeId} • Document ID: {documentId}</Text>
          </View>
          <View style={[styles.docBody, styleMode === 'meme' && { backgroundColor: '#fffdf7' }]}>
            <Text style={styles.docTitle}>{scenario} {styleMode === 'meme' ? '🔥' : ''}</Text>
            <Text style={styles.docSubtle}>By e‑signing, you agree you are a consenting adult and that this is, like, totally a joke. Not legally binding.</Text>
            {styleMode === 'meme' ? (
              <Text style={[styles.docSubtle, { marginTop: 4 }]}>Tagline: {tagline}</Text>
            ) : null}

            <View style={styles.controlsRow}>
              <Checkbox checked={includeDeluxe} onChange={() => setIncludeDeluxe((v) => !v)} />
              <Text style={{ color: '#222' }}>Include Deluxe Parody Clauses</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <DocButton title="Spin the Wheel of Clauses" onPress={() => setWheelClauses((arr) => [...arr, randomClause(includeDeluxe)])} />
              <DocButton title="Add Roast" onPress={() => setWheelClauses((arr) => [...arr, ...roastClauses(nameA, nameB)])} />
            </View>
            <Text style={styles.docBodyText}>{body}</Text>

            <View style={{ height: 12 }} />
            <Text style={styles.sectionHeading}>Signatures</Text>
            <PartyBlock
              party="A"
              adopted={adoptA}
              onAdopt={() => {
                setAdoptA(true);
                if (!initialsA && nameA) setInitialsA(defaultInitials(nameA));
              }}
              name={nameA}
              setName={setNameA}
              initials={initialsA}
              setInitials={setInitialsA}
              sig={sigA}
              setSig={setSigA}
            />
            <View style={{ height: 10 }} />
            <PartyBlock
              party="B"
              adopted={adoptB}
              onAdopt={() => {
                setAdoptB(true);
                if (!initialsB && nameB) setInitialsB(defaultInitials(nameB));
              }}
              name={nameB}
              setName={setNameB}
              initials={initialsB}
              setInitials={setInitialsB}
              sig={sigB}
              setSig={setSigB}
            />
            <Text style={styles.docFooter}>Powered by HotMessSign — Watermark: Totally Not Legally Binding</Text>
            {styleMode === 'meme' ? (
              <Text style={{ color: '#999', fontSize: 10, marginTop: 6, textAlign: 'right' }}>Made with HotMessSign.app</Text>
            ) : null}
          </View>
        </View>
        </ViewShot>
      </ScrollView>

      <View style={[styles.bottomBar, { gap: 8 }]}>
        <Button title={styleMode === 'serious' ? 'Switch to Meme Mode' : 'Switch to Serious Mode'} onPress={() => setStyleMode((m)=> m==='serious'?'meme':'serious')} />
        <Button title="Make it a Meme" onPress={async ()=> {
          if (!docRef.current) return;
          const uri = await docRef.current.capture?.();
          await Clipboard.setStringAsync(`What my date made me sign before Netflix. ${tagline} #HotMessSign`);
          await Sharing.shareAsync(uri, { mimeType: 'image/png' });
        }} />
        <Button title="Review & Finish" onPress={() => setShowReview(true)} />
        <DocButton title="Open Verify (Parody)" onPress={() => navigation.navigate('Verify', { envelope: envelopeId })} />
      </View>

      <Modal visible={showReview} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Review Summary</Text>
            <Text style={styles.modalText}>Scenario: {scenario}</Text>
            <Text style={styles.modalText}>Names: A — {nameA || '—'} | B — {nameB || '—'}</Text>
            <Text style={styles.modalText}>Initials: A — {initialsA || '—'} | B — {initialsB || '—'}</Text>
            <View style={{ height: 12 }} />
            <DocButton title="Finish & Generate PDF" onPress={async () => {
              setShowReview(false);
              const verifyUrl = `hotmess://verify?envelope=${encodeURIComponent(envelopeId)}`;
              await createAndShareAgreementPDF({
                scenario,
                body,
                signatureA: sigA ?? undefined,
                signatureB: sigB ?? undefined,
                nameA,
                nameB,
                initialsA,
                initialsB,
                envelopeId,
                documentId,
                verifyUrl,
              });
            }} />
            <View style={{ height: 8 }} />
            <DocButton title="Close" onPress={() => setShowReview(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <TouchableOpacity onPress={onChange} style={[styles.checkbox, checked && styles.checkboxOn]}>
      {checked ? <Text style={{ color: '#111', fontWeight: '700' }}>✓</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  // Official-looking document wrapper
  docWrap: { backgroundColor: '#f2f5ff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#d9e1ff' },
  docHeader: { backgroundColor: '#0b5fff', borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  docBrand: { color: '#fff', fontWeight: '800' },
  docMeta: { color: '#eaf0ff', fontSize: 12, marginTop: 2 },
  docBody: { backgroundColor: '#fff', padding: 14, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  docTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  docSubtle: { color: '#666', marginTop: 4 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  docBodyText: { color: '#222', lineHeight: 20, marginTop: 10 },
  sectionHeading: { color: '#111', fontWeight: '700', marginBottom: 6, marginTop: 10 },
  signBlock: { position: 'relative' },
  signHeader: { position: 'absolute', right: -6, top: -12, backgroundColor: '#ffc107', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, transform: [{ rotate: '6deg' }], zIndex: 1 },
  signHeaderText: { fontWeight: '800', color: '#111', fontSize: 11 },
  docFooter: { color: '#666', marginTop: 10, textAlign: 'right', fontSize: 12 },
  // General buttons below
  button: { backgroundColor: '#0b5fff', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#0b5fff', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: '#0b5fff' },
  // Party inputs
  input: { backgroundColor: '#f6f8ff', borderColor: '#cad6ff', borderWidth: 1, color: '#111', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 },
  adoptCard: { borderWidth: 1, borderColor: '#d9e1ff', backgroundColor: '#f6f8ff', borderRadius: 8, padding: 12, gap: 8 },
  scriptSample: { fontSize: 24, fontStyle: 'italic', color: '#111' },
  // Modal
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  modalTitle: { fontWeight: '800', fontSize: 18, marginBottom: 6, color: '#111' },
  modalText: { color: '#222', marginBottom: 4 },
});

function randBlock() { return Math.random().toString(36).slice(2, 6).toUpperCase(); }

function DocButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.button, { alignSelf: 'flex-start' }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function PartyBlock({
  party,
  adopted,
  onAdopt,
  name,
  setName,
  initials,
  setInitials,
  sig,
  setSig,
}: {
  party: 'A' | 'B';
  adopted: boolean;
  onAdopt: () => void;
  name: string;
  setName: (v: string) => void;
  initials: string;
  setInitials: (v: string) => void;
  sig: string | null;
  setSig: (v: string | null) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionHeading}>Party {party}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text>Full Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Jane Q. Signer" placeholderTextColor="#8492c4" />
        </View>
        <View style={{ width: 90 }}>
          <Text>Initials</Text>
          <TextInput value={initials} onChangeText={(t)=> setInitials(t.toUpperCase())} style={styles.input} placeholder="JQ" placeholderTextColor="#8492c4" maxLength={4} />
        </View>
      </View>
      {!adopted ? (
        <View style={styles.adoptCard}>
          <Text>Signature Preview</Text>
          <Text style={styles.scriptSample}>{name || 'Your Name'}</Text>
          <DocButton title="Adopt & Continue" onPress={onAdopt} />
        </View>
      ) : (
        <View style={styles.signBlock}>
          <View style={styles.signHeader}><Text style={styles.signHeaderText}>SIGN HERE ▶</Text></View>
          <SignaturePad label={`Party ${party}`} value={sig} onChange={setSig} />
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop: 6 }}>
            <Text><Text style={{ fontWeight:'700' }}>Printed Name:</Text> {name || '—'}</Text>
            <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
              <Text style={{ fontWeight:'700' }}>Initials:</Text>
              <View style={{ borderWidth:1, borderColor:'#999', width:40, height:24, alignItems:'center', justifyContent:'center' }}>
                <Text>{initials || ''}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function defaultInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] || '');
  return (first + last).toUpperCase();
}
