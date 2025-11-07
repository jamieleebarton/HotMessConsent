import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'GenerateOwn'>;

export default function GenerateOwnScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [c1, setC1] = useState('');
  const [c2, setC2] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Own Scenario</Text>
      <Field label="Scenario title" value={title} onChangeText={setTitle} />
      <Field label="Clause #1 (optional)" value={c1} onChangeText={setC1} />
      <Field label="Clause #2 (optional)" value={c2} onChangeText={setC2} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Continue" disabled={!title.trim()} onPress={() => navigation.replace('Agreement', { scenario: title.trim() })} />
      </View>
      <Text style={styles.tip}>Extra clauses can be added via the wheel on the next screen.</Text>
    </View>
  );
}

function Field({ label, ...props }: any) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: '#ddd' }}>{label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor="#888" />
    </View>
  );
}

function Button({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={[styles.button, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  input: { backgroundColor: '#1f1f1f', color: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  button: { backgroundColor: '#ff4c6a', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  tip: { color: '#888' },
});

