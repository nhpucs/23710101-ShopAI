import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import qrcode from 'qrcode-generator';

interface Props {
  value: string;
  size?: number; // Cạnh mã QR (dp), chưa tính viền trắng
}

/**
 * Vẽ mã QR NGAY TRONG APP — không tải ảnh từ Internet nên mất mạng vẫn hiện.
 * qrcode-generator (JS thuần, không native) tính ra "bàn cờ" ô đen/trắng,
 * ta vẽ mỗi HÀNG thành các khối đen liền nhau (gộp ô đen cạnh nhau để bớt số View).
 */
const QrCode = ({ value, size = 200 }: Props) => {
  const rows = useMemo(() => {
    const qr = qrcode(0, 'M'); // 0 = tự chọn kích thước, 'M' = sửa lỗi ~15%
    qr.addData(value);
    qr.make();

    const count = qr.getModuleCount();
    const result: { start: number; length: number }[][] = [];
    for (let r = 0; r < count; r++) {
      const runs: { start: number; length: number }[] = [];
      let c = 0;
      while (c < count) {
        if (qr.isDark(r, c)) {
          const start = c;
          while (c < count && qr.isDark(r, c)) c++;
          runs.push({ start, length: c - start });
        } else {
          c++;
        }
      }
      result.push(runs);
    }
    return { count, rows: result };
  }, [value]);

  const cell = size / rows.count;

  return (
    <View style={styles.quietZone}>
      <View style={{ width: size, height: size }}>
        {rows.rows.map((runs, r) =>
          runs.map(run => (
            <View
              key={`${r}-${run.start}`}
              style={[
                styles.dark,
                {
                  top: r * cell,
                  left: run.start * cell,
                  width: run.length * cell,
                  height: cell,
                },
              ]}
            />
          )),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Viền trắng quanh mã (quiet zone) — thiếu viền này nhiều app quét không nhận
  quietZone: { padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8 },
  dark: { position: 'absolute', backgroundColor: '#000000' },
});

export default memo(QrCode);
