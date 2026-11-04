"""Split verified 312 blank texture and original seals into repeat-ready assets.

Run from the repository root: python release314/build-paper-assets.py
The historical originals and the 312/313 images are never modified.
"""
from PIL import Image, ImageOps, ImageDraw
import numpy as np
import hashlib, io, json, os
from pathlib import Path

OUT = Path('timeline/pages/papers314')
OUT.mkdir(parents=True, exist_ok=True)

def png_atomic(image, path):
    buffer = io.BytesIO()
    image.save(buffer, format='PNG', optimize=True)
    data = buffer.getvalue()
    temp = str(path) + '.tmp'
    with open(temp, 'wb') as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temp, path)
    return hashlib.sha256(data).hexdigest()

def crop_tuple(rect):
    return (rect['x'], rect['y'], rect['x'] + rect['w'], rect['y'] + rect['h'])

def mirror_tile(patch):
    # Each external edge is exactly equal to the opposite external edge.
    # A Canvas repeat therefore never jumps from one paper color to another.
    w, h = patch.size
    tile = Image.new('RGB', (w * 2, h * 2))
    tile.paste(patch, (0, 0))
    tile.paste(ImageOps.mirror(patch), (w, 0))
    tile.paste(ImageOps.flip(patch), (0, h))
    tile.paste(ImageOps.flip(ImageOps.mirror(patch)), (w, h))
    return tile

def seal_alpha(source, rect, parameters):
    image = source.crop(crop_tuple(rect)).convert('RGBA')
    data = np.array(image).astype(np.float32)
    red, green, blue = data[:, :, 0], data[:, :, 1], data[:, :, 2]
    alpha = np.clip((red - green - parameters['coefficient'] * np.maximum(green-blue, 0)
                     - parameters['bias']) / parameters['range'], 0, 1)
    h, w = alpha.shape
    yy, xx = np.mgrid[:h, :w]
    edge = np.minimum.reduce([xx, yy, w - 1 - xx, h - 1 - yy])
    alpha *= np.clip(edge / 7, 0, 1)
    data[:, :, 3] = np.round(alpha * 255)
    return Image.fromarray(data.astype('uint8'), 'RGBA')

def repeated_preview(row, width, height):
    tile = Image.open(row['tile314']['image']).convert('RGB')
    k = min(width, height) / row['tile314']['referenceShortSide'] * row['tile314']['referenceScale']
    tile = tile.resize((max(1, round(tile.width * k)), max(1, round(tile.height * k))), Image.Resampling.LANCZOS)
    result = Image.new('RGBA', (width, height))
    for y in range(0, height, tile.height):
        for x in range(0, width, tile.width):
            result.paste(tile, (x, y))
    for seal in row['seals314']:
        stamp = Image.open(seal['image']).convert('RGBA')
        sw = max(1, round(min(width, height) * seal['relativeWidth']))
        sh = max(1, round(sw * stamp.height / stamp.width))
        stamp = stamp.resize((sw, sh), Image.Resampling.LANCZOS)
        inset = round(min(width, height) * seal['insetRatio'])
        sx = inset if seal['edge'] == 'left' else width - inset - sw
        sy = round(height * seal['centerY'] - sh / 2)
        result.alpha_composite(stamp, (sx, sy))
    return result.convert('RGB')

rows = json.load(open('release313/papers.json'))
result = []
for original in rows:
    row = dict(original)
    layout = row['layout313']
    source = Image.open(layout['source312']).convert('RGB')
    patch = source.crop(crop_tuple(layout['textureRect312']))
    tile = mirror_tile(patch)
    tile_path = OUT / (row['id'] + '-tile.png')
    tile_hash = png_atomic(tile, tile_path)
    # Lossless texture carries no red stamp; stamps remain separate layers.
    row['tile314'] = {
        'image': str(tile_path), 'width': tile.width, 'height': tile.height,
        'referenceScale': layout['textureScale'], 'referenceShortSide': 900,
        'source312': layout['source312'], 'sourceRect312': layout['textureRect312'],
        'method': '2x2 mirrored blank-paper patch; opposite edge pixels equal',
        'sha256': tile_hash
    }
    row['seals314'] = []
    for number, placement in enumerate(layout['seals'], 1):
        image = seal_alpha(source, placement['sourceRect312'], layout['sealExtraction'])
        path = OUT / (row['id'] + '-seal-' + str(number) + '.png')
        digest = png_atomic(image, path)
        center_x = placement['x'] + placement['width'] / 2
        edge = 'left' if center_x < 450 else 'right'
        inset = placement['x'] if edge == 'left' else 900 - placement['x'] - placement['width']
        row['seals314'].append({
            'image': str(path), 'width': image.width, 'height': image.height,
            'relativeWidth': placement['relativeWidth'], 'edge': edge,
            'insetRatio': round(inset / 900, 8),
            'centerY': round((placement['y'] + placement['height'] / 2) / 1200, 8),
            'source312': layout['source312'], 'sourceRect312': placement['sourceRect312'],
            'alphaMethod': layout['sealExtraction'], 'sha256': digest
        })
    row['layout314'] = {
        'kind': 'seamless-paper-repeat-with-independent-edge-seals',
        'textureAspect': 'preserve; repeat rather than stretch',
        'sealSizing': 'short-side relative, independent of work width',
        'fallbackImage': row['image'], 'fallbackThumbnail': row['thumbnail']
    }
    row['processing314'] = '原图天然无字无章纸纹作双向镜像无缝循环；真实朱印以透明图层独立按短边比例贴边排版，纸纹不混入朱印。'
    a = np.asarray(tile)
    assert np.array_equal(a[:, 0], a[:, -1]), row['id']
    assert np.array_equal(a[0], a[-1]), row['id']
    for seal in row['seals314']:
        alpha = np.asarray(Image.open(seal['image']))[:, :, 3]
        assert alpha.max() > 0 and alpha.min() == 0
        assert not alpha[0].any() and not alpha[-1].any()
        assert not alpha[:, 0].any() and not alpha[:, -1].any()
    result.append(row)

Path('release314').mkdir(exist_ok=True)
with open('release314/papers.json', 'w') as output:
    json.dump(result, output, ensure_ascii=False, indent=2)
    output.write('\n')

# A small portrait + wide-scroll contact sheet for visual review.
contact = Image.new('RGB', (1200, 850), '#ece8df')
draw = ImageDraw.Draw(contact)
for index, row in enumerate(result):
    top = index * 170
    draw.text((8, top + 4), row['id'], fill='#302920')
    portrait = repeated_preview(row, 105, 140)
    contact.paste(portrait, (8, top + 24))
    banner = repeated_preview(row, 1060, 140)
    contact.paste(banner, (128, top + 24))
contact.save('/tmp/papers314-contact.jpg', quality=92)
print('Five seamless texture tiles, eight transparent seals, and manifest generated.')
