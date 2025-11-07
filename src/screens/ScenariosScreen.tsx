import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Scenario } from '../data/clauses';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Scenarios'>;

export default function ScenariosScreen({ navigation }: Props) {
  const [deluxeUnlocked, setDeluxeUnlocked] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pick your scenario</Text>

      {Object.values(Scenario).map((label) => (
        <Button key={label} title={label} onPress={() => navigation.navigate('Agreement', { scenario: label })} />
      ))}

      <Button title="Generate Your Own" onPress={() => navigation.navigate('GenerateOwn')} />

      <View style={styles.divider} />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Deluxe Pack</Text>
        <Text style={styles.body}>Celebrity parody clauses like the Kanye Clause, Taylor Swift Addendum, etc.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Button title={deluxeUnlocked ? 'Deluxe: Unlocked (Mock)' : 'Unlock Deluxe (Mock)'} onPress={() => setDeluxeUnlocked((v) => !v)} />
          <Text style={styles.muted}>{deluxeUnlocked ? 'Enjoy extra clauses in agreements' : 'Deluxe content locked'}</Text>
        </View>
      </View>

      <Text style={styles.tip}>Tip: you can add Deluxe clauses from the agreement screen even if locked (preview).</Text>
    </ScrollView>
  );
}

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '600', color: '#fff' },
  button: { backgroundColor: '#ff4c6a', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  card: { backgroundColor: '#1f1f1f', borderRadius: 8, padding: 16, gap: 8 },
  cardTitle: { color: '#fff', fontWeight: '700' },
  body: { color: '#ddd' },
  muted: { color: '#aaa' },
  tip: { color: '#888', marginTop: 16 },
});

