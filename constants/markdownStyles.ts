import { Platform } from "react-native";

export const MarkdownStyles = {
  root: {},
  // --- TITRES ---
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600', // Utilisation de "600" au lieu de semibold
    marginBottom: 2,
  },
  heading4: {
    fontSize: 16,
    fontWeight: '600',
  },
  heading5: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heading6: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },

  // --- TEXTE ---
  paragraph: {
    marginVertical: 4,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  strong: {
    fontWeight: 'bold',
  },
  emphasis: {
    fontStyle: 'italic',
  },

  // --- ÉLÉMENTS VISUELS ---
  thematicBreak: {
    height: 1,
    backgroundColor: '#00000020',
    marginVertical: 12,
    width: '100%',
  },
  blockquote: {
    backgroundColor: '#00000008',
    borderColor: '#3840ba',
    borderLeftWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 8,
    borderRadius: 4,
  },

  // --- CODE ---
  code: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
    ...Platform.select({
      ios: { fontFamily: 'Menlo' },
      android: { fontFamily: 'monospace' },
    }),
  },
  inlineCode: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontSize: 14,
    ...Platform.select({
      ios: { fontFamily: 'Menlo' },
      android: { fontFamily: 'monospace' },
    }),
  },

  // --- LIENS ---
  link: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },

  // --- MULTIMÉDIA ---
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },

  // --- LISTES ---
  list: {
    marginVertical: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  listBullet: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  delete: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
} as const; 