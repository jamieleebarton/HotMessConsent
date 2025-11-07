import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Signature from 'react-native-signature-canvas';

type Props = {
  label: string;
  value?: string | null; // base64 PNG (without prefix)
  onChange: (base64OrNull: string | null) => void;
  height?: number;
};

export default function SignaturePad({ label, value, onChange, height = 180 }: Props) {
  const ref = useRef<Signature>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ height, backgroundColor: '#fff', borderWidth: 1, borderColor: '#999' }}>
        <Signature
          ref={ref}
          onOK={(sig) => {
            // sig is dataURL: data:image/png;base64,XXXX
            const base64 = sig.replace(/^data:image\/(png|jpg);base64,/, '');
            onChange(base64);
          }}
          onEmpty={() => onChange(null)}
          webStyle={webStyle}
          descriptionText=""
          clearText="Clear"
          confirmText="Save"
        />
      </View>
      {value ? (
        <Text style={styles.saved}>Saved ✓</Text>
      ) : (
        <Text style={styles.hint}>Sign above, then tap Save</Text>
      )}
    </View>
  );
}

const webStyle = `
.m-signature-pad--footer {display: flex; justify-content: space-between; align-items: center;}
.m-signature-pad--footer .button {background: #efefef; border: 1px solid #999; color: #111;}
body,html {width:100%; height:100%;}
`;

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: '#ddd', fontWeight: '600' },
  saved: { color: '#5fd38d' },
  hint: { color: '#aaa' },
});

