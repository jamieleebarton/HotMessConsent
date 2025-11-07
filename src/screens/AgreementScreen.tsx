import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import SignaturePad from '../components/SignaturePad';
import { Clause, defaultBody, randomClause } from '../data/clauses';
import { createAndShareAgreementPDF } from '../utils/pdf';

type Props = NativeStackScreenProps<RootStackParamList, 'Agreement'>;

export default function AgreementScreen({ route, navigation }: Props) {
  const { scenario } = route.params;
  const [includeDeluxe, setIncludeDeluxe] = useState(false);
  const [wheelClauses, setWheelClauses] = useState<Clause[]>([]);
  const [sigA, setSigA] = useState<string | null>(null);
  const [sigB, setSigB] = useState<string | null>(null);

  const body = useMemo(() => defaultBody(scenario, includeDeluxe, wheelClauses), [scenario, includeDeluxe, wheelClauses]);

  // Generate local IDs for the on-screen parody doc header
  const [envelopeId] = useState(() => `HM-${randBlock()}-${randBlock()}-${randBlock()}`);
  const [documentId] = useState(() => `DOC-${randBlock()}`);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.docWrap}>
          <View style={styles.docHeader}>
            <Text style={styles.docBrand}>HotMessSign eSignature — Totally Not DocuSign</Text>
            <Text style={styles.docMeta}>Envelope ID: {envelopeId} • Document ID: {documentId}</Text>
          </View>
          <View style={styles.docBody}>
            <Text style={styles.docTitle}>{scenario}</Text>
            <Text style={styles.docSubtle}>By e‑signing, you agree you are a consenting adult and that this is, like, totally a joke. Not legally binding.</Text>

            <View style={styles.controlsRow}>
              <Checkbox checked={includeDeluxe} onChange={() => setIncludeDeluxe((v) => !v)} />
              <Text style={{ color: '#222' }}>Include Deluxe Parody Clauses</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <DocButton title="Spin the Wheel of Clauses" onPress={() => setWheelClauses((arr) => [...arr, randomClause(includeDeluxe)])} />
            </View>
            <Text style={styles.docBodyText}>{body}</Text>

            <View style={{ height: 12 }} />
            <Text style={styles.sectionHeading}>Signatures</Text>
            <View style={styles.signBlock}>
              <View style={styles.signHeader}><Text style={styles.signHeaderText}>SIGN HERE ▶</Text></View>
              <SignaturePad label="Party A" value={sigA} onChange={setSigA} />
            </View>
            <View style={{ height: 10 }} />
            <View style={styles.signBlock}>
              <View style={styles.signHeader}><Text style={styles.signHeaderText}>SIGN HERE ▶</Text></View>
              <SignaturePad label="Party B" value={sigB} onChange={setSigB} />
            </View>
            <Text style={styles.docFooter}>Powered by HotMessSign — Watermark: Totally Not Legally Binding</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Generate PDF & Share"
          onPress={async () => {
            await createAndShareAgreementPDF({ scenario, body, signatureA: sigA ?? undefined, signatureB: sigB ?? undefined });
          }}
        />
      </View>
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
});

function randBlock() { return Math.random().toString(36).slice(2, 6).toUpperCase(); }

function DocButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.button, { alignSelf: 'flex-start' }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
