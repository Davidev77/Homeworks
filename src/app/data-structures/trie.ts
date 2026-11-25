class TrieNode {
  children = new Map<string, TrieNode>();
  title: string | null = null; 
}

export class Trie {
  private root = new TrieNode();

  insert(title: string): void {
    let node = this.root;
    for (const ch of title.toLowerCase()) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.title = title;
  }

  // existe exactamente este título? 
  search(title: string): boolean {
    return this.find(title)?.title != null;
  }

  // Sugerencias del prefijo a la hora de buscar la canción
  suggest(prefix: string, limit = 6): string[] {
    const start = this.find(prefix);
    const out: string[] = [];
    if (!start) return out;
    const dfs = (n: TrieNode) => {
      if (out.length >= limit) return;
      if (n.title) out.push(n.title);
      for (const child of n.children.values()) dfs(child);
    };
    dfs(start);
    return out;
  }

  private find(text: string): TrieNode | null {
    let node = this.root;
    for (const ch of text.toLowerCase()) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}
