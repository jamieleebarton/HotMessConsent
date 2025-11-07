import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Verify'>;

export default function VerifyScreen({ route }: Props) {
  const { envelope } = route.params;
  const now = new Date().toLocaleString();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certificate Verification (Parody)</Text>
      <Text style={styles.mono}>Envelope ID: {envelope}</Text>
      <View style={styles.card}>
        <Row label="Status" value="Verified — Totally Not Legally Binding" />
        <Row label="Checked" value={now} />
        <Row label="Authority" value="HotMessSign eSignature" />
        <Row label="Integrity" value="Looks official, promises chaos" />
      </View>
      <Text style={styles.note}>This screen is for laughs only — no legal effect.</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#111' },
  title: { color: '#fff', fontWeight: '800', fontSize: 18 },
  mono: { color: '#9ad', fontFamily: 'Menlo', fontSize: 12 },
  card: { backgroundColor: '#1f1f1f', padding: 16, borderRadius: 8, gap: 8, borderWidth: 1, borderColor: '#2a2a2a' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#bbb' },
  value: { color: '#fff', fontWeight: '700' },
  note: { color: '#888' },
});

