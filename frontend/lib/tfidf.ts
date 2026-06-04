// TF-IDF and Cosine Similarity Utility in TypeScript

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
  "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
  "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
  "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself",
  "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
  "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off",
  "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
  "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that",
  "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they",
  "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until",
  "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why",
  "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // strip punctuation except dash
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));
}

export function computeCosineSimilarity(docA: string, docB: string): number {
  const tokensA = tokenize(docA);
  const tokensB = tokenize(docB);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0;
  }

  // Vocabulary
  const vocab = new Set([...tokensA, ...tokensB]);

  // Term frequencies
  const tfA: Record<string, number> = {};
  const tfB: Record<string, number> = {};

  tokensA.forEach((token) => {
    tfA[token] = (tfA[token] || 0) + 1;
  });
  tokensB.forEach((token) => {
    tfB[token] = (tfB[token] || 0) + 1;
  });

  // Calculate TF-IDF vectors
  // Since we only have 2 documents in this comparison, IDF is:
  // idf = log(1 + 2 / (1 + doc_freq))
  // if term in both, doc_freq = 2 -> idf = log(1 + 2/3) = log(1.666) = 0.51
  // if term in one, doc_freq = 1 -> idf = log(1 + 2/2) = log(2) = 0.69
  // To keep it simple and robust, we can just use TF-IDF or normalized TF weights.
  // Actually, standard cosine similarity on TF vectors works extremely well and is highly robust for resume-to-JD checks.
  // Let's implement full TF-IDF with a document corpus of [docA, docB].
  const vectorA: number[] = [];
  const vectorB: number[] = [];

  vocab.forEach((term) => {
    const docFreq = (tfA[term] ? 1 : 0) + (tfB[term] ? 1 : 0);
    const idf = Math.log(1 + 2 / (1 + docFreq));

    const valA = ((tfA[term] || 0) / tokensA.length) * idf;
    const valB = ((tfB[term] || 0) / tokensB.length) * idf;

    vectorA.push(valA);
    vectorB.push(valB);
  });

  // Compute Cosine Similarity
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

// Predict roles based on matching user profile terms with role skills dataset
export function computeRoleSimilarities(profileText: string, dataset: Record<string, string[]>): { role: string; score: number }[] {
  const profileTokens = new Set(tokenize(profileText));
  
  return Object.entries(dataset).map(([role, skills]) => {
    const roleSkillsLower = skills.map(s => s.toLowerCase());
    
    // Skill match score: intersection / total skills in role
    const matched = roleSkillsLower.filter(s => profileTokens.has(s));
    const skillScore = roleSkillsLower.length > 0 ? matched.length / roleSkillsLower.length : 0;
    
    // Semantic/text similarity score
    const roleText = skills.join(" ");
    const textSimilarity = computeCosineSimilarity(profileText, roleText);
    
    // Final weighted score: 65% skills intersection, 35% text similarity
    const finalScore = (skillScore * 0.65) + (textSimilarity * 0.35);
    
    return {
      role,
      score: Math.round(finalScore * 10000) / 100 // 2 decimal places percentage
    };
  });
}
