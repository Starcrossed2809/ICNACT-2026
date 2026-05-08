import re

with open('style.css', 'r') as f:
    css = f.read()

# Remove backdrop-filter
css = re.sub(r'\s*backdrop-filter:[^;]+;', '', css)

# Remove :root[data-theme="light"] blocks
css = re.sub(r':root\[data-theme="light"\]\s*{[^}]*}', '', css)
css = re.sub(r':root\[data-theme="light"\][^{]*{[^}]*}', '', css)

# Update .site-header.is-scrolled
css = re.sub(r'\.site-header\.is-scrolled\s*{[^}]*}', '.site-header.is-scrolled {\n    background: var(--bg);\n    box-shadow: var(--shadow);\n  }', css)

# Update buttons
css = re.sub(r'\.btn\s*{([^}]+)}', lambda m: '.btn {' + m.group(1) + '\n    box-shadow: var(--shadow);\n  }', css)

# Remove old btn-primary box shadow and gradient
css = re.sub(r'\.btn-primary\s*{[^}]*}', '.btn-primary {\n    background: var(--bg);\n    color: var(--primary);\n  }', css)

# Update btn:active
css = re.sub(r'\.btn:active\s*{[^}]*}', '.btn:active {\n    transform: translateY(1px);\n    box-shadow: var(--shadow-inset);\n  }', css)

# Update .btn-ghost and .btn-soft to just use default btn shadow, so we can clear their backgrounds
css = re.sub(r'\.btn-ghost\s*{[^}]*}', '.btn-ghost {\n    background: var(--bg);\n    color: var(--text);\n  }', css)
css = re.sub(r'\.btn-soft\s*{[^}]*}', '.btn-soft {\n    background: var(--bg);\n    color: var(--text);\n  }', css)

# Update hero-card
css = re.sub(r'background:\s*linear-gradient\([^;]+;\s*(?=box-shadow:\s*var\(--shadow\);)', 'background: var(--bg);\n    ', css)
css = re.sub(r'(\.hero-card\s*{[^}]*)background:\s*linear-gradient[^;]+;', r'\1background: var(--bg);', css)

# Update brand-mark
css = re.sub(r'(\.brand-mark\s*{[^}]*)background:\s*linear-gradient[^;]+;', r'\1background: var(--bg);\n    color: var(--primary);', css)
css = re.sub(r'(\.brand-mark\s*{[^}]*)box-shadow:[^;]+;', r'\1box-shadow: var(--shadow);', css)

# Update pill
css = re.sub(r'(\.pill\s*{[^}]*)border:\s*1px\s*solid\s*var\(--border\);', r'\1border: none;\n    box-shadow: var(--shadow-inset);', css)

# Update search input
search_input_replacement = '''  .search input[type="search"] {
    width: 100%;
    padding: 12px 12px;
    border-radius: 14px;
    border: none;
    background: var(--bg);
    box-shadow: var(--shadow-inset);
    color: var(--text);
    outline: none;
    margin-top: 10px;
  }'''
css = re.sub(r'\.search input\[type="search"\]\s*{[^}]*}', search_input_replacement, css)

# Update toast
css = re.sub(r'(\.toast\s*{[^}]*)background:[^;]+;', r'\1background: var(--bg);', css)
css = re.sub(r'(\.toast\s*{[^}]*)border:[^;]+;', r'\1border: none;', css)
css = re.sub(r'(\.toast\s*{[^}]*)color:\s*rgba\([^;]+;', r'\1color: var(--text);', css)

# Update .link
css = re.sub(r'\.link\s*{[^}]*}', '.link {\n    color: var(--primary);\n    text-decoration: none;\n    font-weight: 600;\n  }', css)

with open('style.css', 'w') as f:
    f.write(css)
