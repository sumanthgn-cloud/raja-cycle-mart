import os

root_dir = r"C:\Users\gnsum\OneDrive\Desktop\HTML"
blog_dir = os.path.join(root_dir, "blog")

def update_html_content(content, is_blog):
    prefix = "../" if is_blog else ""
    
    # We are replacing the previous SVG line for light scheme
    # Old line (from last step):
    # <link rel="icon" type="image/svg+xml" href="{prefix}images/favicon/favicon.svg" media="(prefers-color-scheme: light)" />
    
    # New line:
    # <link rel="icon" type="image/png" href="{prefix}images/favicon/web-app-manifest-192x192.png" media="(prefers-color-scheme: light)" />
    
    target_str = 'images/favicon/favicon.svg'
    # We search for the specific line with media query
    full_target_snippet = f'href="{prefix}images/favicon/favicon.svg" media="(prefers-color-scheme: light)"'
    
    replacement_line = f'  <link rel="icon" type="image/png" href="{prefix}images/favicon/web-app-manifest-192x192.png" media="(prefers-color-scheme: light)" />'
    
    lines = content.splitlines()
    new_lines = []
    
    for line in lines:
        if full_target_snippet in line:
            new_lines.append(replacement_line)
        else:
            new_lines.append(line)
            
    return "\n".join(new_lines)

def process_directory(directory, is_blog):
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = update_html_content(content, is_blog)
                
                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated: {filename}")
                    count += 1
                else:
                    print(f"Skipped (target not found): {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    return count

print("Updating Root Files...")
c1 = process_directory(root_dir, False)

print("\nUpdating Blog Files...")
c2 = process_directory(blog_dir, True)

print(f"\nTotal files updated: {c1 + c2}")
