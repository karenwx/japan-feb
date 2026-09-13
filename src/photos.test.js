import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const sources = JSON.parse(readFileSync(new URL('../docs/photo-sources.json', import.meta.url), 'utf8'));
const data = vm.runInNewContext(html.slice(html.indexOf('const IMG ='), html.indexOf('// ---------- state ----------')) + '\n({IMG,PHOTO,R,H})');
describe('venue photo provenance', () => {
  it('maps every venue to its own audited source and matching embedded image', () => {
    const venues = [...data.R, ...data.H];
    expect(venues).toHaveLength(53);
    expect(new Set(venues.map(r => r.img)).size).toBe(53);
    for (const venue of venues) {
      const source = sources.find(s => s.key === venue.img);
      expect(source?.name).toBe(venue.name);
      expect(data.PHOTO[venue.img].source).toBe(source.source);
      if (source.status === 'verified') {
        const raw = Buffer.from(data.IMG[venue.img].split(',')[1], 'base64');
        expect(raw.toString('ascii', 8, 12)).toBe('WEBP');
        expect(createHash('sha256').update(raw).digest('hex')).toBe(source.sha256);
      } else {
        expect(data.IMG[venue.img]).toBeUndefined();
      }
    }
  });
  it('uses the Kyoto Ekimae gallery for Dormy Inn and avoids shared stock images', () => {
    const dormy = data.H.find(r => r.name === 'Dormy Inn Premium Kyoto Ekimae');
    expect(data.PHOTO[dormy.img].source).toBe('https://dormy-hotels.com/dormyinn/hotels/kyoto/gallery/');
    expect(data.PHOTO[dormy.img].alt).toContain('Indoor public bath');
    expect(new Set(Object.values(data.IMG)).size).toBe(Object.keys(data.IMG).length);
  });
});
