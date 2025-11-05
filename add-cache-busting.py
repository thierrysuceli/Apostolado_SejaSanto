#!/usr/bin/env python3
"""
Script para adicionar cache-busting headers em todos os endpoints de mutação
"""

import os
import re
from pathlib import Path

CACHE_HEADERS = """
      // 🚫 CACHE BUSTING
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
"""

def add_cache_busting(file_path):
    """Adiciona cache-busting antes de cada return res.status(201|200).json em mutações"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = 0
    
    # Pattern: encontrar linhas com return res.status(200|201).json que NÃO sejam GET
    # e que NÃO tenham cache-busting já
    
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Verifica se é um return de mutação (201 = CREATE, 200 em PUT/DELETE/POST)
        if 'return res.status(20' in line and '.json(' in line:
            # Verifica se já tem cache busting nas últimas 5 linhas
            has_cache = False
            for j in range(max(0, i-5), i):
                if 'Cache-Control' in lines[j] or 'CACHE BUSTING' in lines[j]:
                    has_cache = True
                    break
            
            # Verifica se é status 201 (sempre mutação) ou 200 em contexto de mutação
            is_mutation = False
            if 'res.status(201)' in line:
                is_mutation = True
            elif 'res.status(200)' in line:
                # Verifica se está em contexto de PUT, POST ou DELETE
                for j in range(max(0, i-30), i):
                    if any(method in lines[j] for method in ["req.method === 'PUT'", "req.method === 'POST'", "req.method === 'DELETE'", "req.method === 'PATCH'"]):
                        # Verifica que não é GET
                        not_get = True
                        for k in range(max(0, i-30), i):
                            if "req.method === 'GET'" in lines[k] and k > j:
                                not_get = False
                                break
                        if not_get:
                            is_mutation = True
                            break
            
            if is_mutation and not has_cache:
                # Adiciona cache busting antes do return
                indent = len(line) - len(line.lstrip())
                cache_lines = CACHE_HEADERS.strip().split('\n')
                for cache_line in cache_lines:
                    new_lines.append(' ' * indent + cache_line)
                new_lines.append('')
                changes += 1
        
        new_lines.append(line)
        i += 1
    
    if changes > 0:
        new_content = '\n'.join(new_lines)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ {file_path.name}: {changes} cache-busting headers adicionados")
        return True
    else:
        print(f"⏭️  {file_path.name}: Sem mudanças necessárias")
        return False

def main():
    api_dir = Path('api')
    
    if not api_dir.exists():
        print("❌ Diretório 'api' não encontrado!")
        return
    
    total_files = 0
    total_changes = 0
    
    # Percorrer todos os arquivos .js na pasta api
    for js_file in api_dir.rglob('*.js'):
        if '__pycache__' in str(js_file) or 'node_modules' in str(js_file):
            continue
        
        total_files += 1
        if add_cache_busting(js_file):
            total_changes += 1
    
    print(f"\n📊 Resumo:")
    print(f"   Arquivos processados: {total_files}")
    print(f"   Arquivos modificados: {total_changes}")

if __name__ == '__main__':
    main()
