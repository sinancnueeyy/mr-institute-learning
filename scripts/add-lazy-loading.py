import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all <img ...> tags and add loading="lazy" if not present
    def replace_img(match):
        tag = match.group(0)
        if 'loading="lazy"' not in tag:
            # insert loading="lazy" after <img 
            return tag.replace('<img ', '<img loading="lazy" ', 1)
        return tag

    new_content = re.sub(r'<img\s+[^>]*>', replace_img, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk('c:\\Users\\sinan muhammed\\Desktop\\ELEVATE PROJECTS BACKUPS\\mr institute main folder\\src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
