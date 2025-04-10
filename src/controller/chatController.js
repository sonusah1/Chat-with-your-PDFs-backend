import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";

  import Document from '../models/Document.js';
  
  const chatWithDoc = async (req, res) => {
    const { docId, question } = req.body;
  
    try {
      const doc = await Document.findById(docId);
      if (!doc) return res.status(404).json({ message: 'Document not found' });
  
      // Create embeddings for the PDF content using OpenAI
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
      });
  
      // Build an in-memory vector store from the document's content
      const vectorStore = await MemoryVectorStore.fromTexts(
        [doc.content],
        [{ docId: doc._id.toString() }],
        embeddings
      );
  
      // Create the OpenAI language model
      const model = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0
      });
  
      // Create the retrieval QA chain
      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  
      // Get answer from the chain
      const response = await chain.call({ query: question });
  
      res.status(200).json({ answer: response.text });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export { chatWithDoc };
  