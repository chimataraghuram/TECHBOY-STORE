import os
import sys
from PIL import Image
from collections import deque

def is_bg_pixel(c, bg_color, tolerance=235):
    # Check if pixel matches near-white or matches corner background color
    if len(c) == 4 and c[3] == 0:
        return True
    r, g, b = c[:3]
    # If standard near-white
    if r >= tolerance and g >= tolerance and b >= tolerance:
        return True
    # If matching off-white background color within distance
    if bg_color:
        br, bg, bb = bg_color[:3]
        if abs(r - br) <= 15 and abs(g - bg) <= 15 and abs(b - bb) <= 15:
            return True
    return False

def remove_detached_slices(img, tolerance=235):
    w, h = img.size
    # Count non-bg pixels per column
    col_counts = []
    for x in range(w):
        cnt = sum(1 for y in range(h) if not is_bg_pixel(img.getpixel((x, y)), None, tolerance))
        col_counts.append(cnt)

    crop_left = 0
    left_limit = int(w * 0.28)
    gap_start = None
    for x in range(left_limit):
        if col_counts[x] == 0:
            if gap_start is None:
                gap_start = x
            elif x - gap_start >= 4:
                crop_left = x + 1
        else:
            if gap_start is not None and x - gap_start < 4:
                gap_start = None

    crop_right = w
    start_search = int(w * 0.72)
    gap_start = None
    for x in range(start_search, w):
        if col_counts[x] == 0:
            if gap_start is None:
                gap_start = x
            elif x - gap_start >= 4:
                crop_right = gap_start
                break
        else:
            gap_start = None

    if crop_left > 0 or crop_right < w:
        img = img.crop((crop_left, 0, crop_right, h))
    return img

def process_phone_image(img_path, out_path, tolerance=235):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size

    # Check corners to get background color
    c0 = img.getpixel((0, 0))
    c1 = img.getpixel((w - 1, 0))
    c2 = img.getpixel((0, h - 1))
    c3 = img.getpixel((w - 1, h - 1))
    
    # If already mostly transparent
    if any(c[3] == 0 for c in [c0, c1, c2, c3]):
        # Just trim excess transparent borders and save
        bbox = img.getbbox()
        if bbox:
            pad = 12
            x1 = max(0, bbox[0] - pad)
            y1 = max(0, bbox[1] - pad)
            x2 = min(w, bbox[2] + pad)
            y2 = min(h, bbox[3] + pad)
            img = img.crop((x1, y1, x2, y2))
        img.save(out_path, 'PNG')
        return img.size

    # Off-white / white background color reference
    corners = [c0, c1, c2, c3]
    avg_r = sum(c[0] for c in corners) // 4
    avg_g = sum(c[1] for c in corners) // 4
    avg_b = sum(c[2] for c in corners) // 4
    bg_color = (avg_r, avg_g, avg_b)

    # 1. Remove detached side slices (GSMArena third profile)
    img = remove_detached_slices(img, tolerance=tolerance)
    w, h = img.size

    # 2. Floodfill transparency from perimeter
    visited = set()
    queue = deque()

    # Seed top and bottom borders
    for x in range(w):
        for y in range(min(5, h)):
            if (x, y) not in visited and is_bg_pixel(img.getpixel((x, y)), bg_color, tolerance):
                queue.append((x, y))
                visited.add((x, y))
        for y in range(max(0, h - 5), h):
            if (x, y) not in visited and is_bg_pixel(img.getpixel((x, y)), bg_color, tolerance):
                queue.append((x, y))
                visited.add((x, y))

    # Seed left and right borders
    for y in range(h):
        for x in range(min(5, w)):
            if (x, y) not in visited and is_bg_pixel(img.getpixel((x, y)), bg_color, tolerance):
                queue.append((x, y))
                visited.add((x, y))
        for x in range(max(0, w - 5), w):
            if (x, y) not in visited and is_bg_pixel(img.getpixel((x, y)), bg_color, tolerance):
                queue.append((x, y))
                visited.add((x, y))

    pixels = img.load()
    while queue:
        cx, cy = queue.popleft()
        pixels[cx, cy] = (0, 0, 0, 0)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                c = pixels[nx, ny]
                if is_bg_pixel(c, bg_color, tolerance):
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    # 3. Clean floating watermark text in bottom 28px
    for y in range(max(0, h - 28), h):
        for x in range(max(0, w - 200), w):
            if pixels[x, y][3] > 0:
                # Count transparent neighbors in a 5x5 window
                trans_neighbors = sum(
                    1 for dx in range(-2, 3) for dy in range(-2, 3)
                    if 0 <= x + dx < w and 0 <= y + dy < h and pixels[x + dx, y + dy][3] == 0
                )
                if trans_neighbors >= 13:
                    pixels[x, y] = (0, 0, 0, 0)

    # 4. Trim bounding box with 10px padding
    bbox = img.getbbox()
    if bbox:
        pad = 10
        x1 = max(0, bbox[0] - pad)
        y1 = max(0, bbox[1] - pad)
        x2 = min(w, bbox[2] + pad)
        y2 = min(h, bbox[3] + pad)
        img = img.crop((x1, y1, x2, y2))

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, 'PNG')
    return img.size

if __name__ == '__main__':
    phone_dir = 'frontend/public/images/phones'
    out_dir = 'frontend/public/images/phones_clean'
    os.makedirs(out_dir, exist_ok=True)
    
    files = sorted([f for f in os.listdir(phone_dir) if not f.startswith('test-')])
    print(f'Starting processing of {len(files)} files...')
    
    success = 0
    for f in files:
        in_path = os.path.join(phone_dir, f)
        base_name = os.path.splitext(f)[0]
        out_path = os.path.join(out_dir, f'{base_name}.png')
        
        # Special case: nothing-phone-3a banner vs studio
        if f == 'nothing-phone-3a.jpg':
            # use nothing-phone-3a-pro as base if available
            pro_in = os.path.join(phone_dir, 'nothing-phone-3a-pro.jpg')
            if os.path.exists(pro_in):
                in_path = pro_in
                
        try:
            sz = process_phone_image(in_path, out_path)
            print(f'OK: {f} -> {base_name}.png {sz}')
            success += 1
        except Exception as e:
            print(f'ERR: {f} -> {e}')

    print(f'Done: {success}/{len(files)} processed successfully.')
