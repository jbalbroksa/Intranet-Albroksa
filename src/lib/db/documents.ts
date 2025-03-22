import { supabase } from "../supabase";
import { Database } from "@/types/database.types";

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentTag = Database["public"]["Tables"]["document_tags"]["Row"];

/**
 * Get all documents with their tags
 */
export async function getDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      users:uploaded_by(id, full_name, avatar_url),
      document_tags(id, tag),
      companies:company_id(id, name),
      content:content_id(id, title)
    `,
    )
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    fileType: doc.file_type,
    category: doc.category,
    uploadedBy: {
      name: doc.users?.full_name || "Usuario",
      avatar:
        doc.users?.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.uploaded_by}`,
    },
    uploadedAt: new Date(doc.uploaded_at),
    fileSize: doc.file_size,
    version: doc.version,
    tags: doc.document_tags?.map((tag) => tag.tag) || [],
    fileUrl: doc.file_path
      ? supabase.storage.from("documents").getPublicUrl(doc.file_path).data
          .publicUrl
      : undefined,
    // Add linked entity information
    companyId: doc.company_id || undefined,
    companyName: doc.companies?.name || undefined,
    productId: doc.content_id || undefined,
    productTitle: doc.content?.title || undefined,
    productCategory: doc.category || undefined,
    productSubcategory: doc.subcategory || undefined,
  }));
}

/**
 * Get a document by ID
 */
export async function getDocumentById(id: string) {
  const { data, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      users:uploaded_by(id, full_name, avatar_url),
      document_tags(id, tag),
      companies:company_id(id, name),
      content:content_id(id, title)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    fileType: data.file_type,
    category: data.category,
    uploadedBy: {
      name: data.users?.full_name || "Usuario",
      avatar:
        data.users?.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.uploaded_by}`,
    },
    uploadedAt: new Date(data.uploaded_at),
    fileSize: data.file_size,
    version: data.version,
    tags: data.document_tags?.map((tag) => tag.tag) || [],
    fileUrl: data.file_path
      ? supabase.storage.from("documents").getPublicUrl(data.file_path).data
          .publicUrl
      : undefined,
    // Add linked entity information
    companyId: data.company_id || undefined,
    companyName: data.companies?.name || undefined,
    productId: data.content_id || undefined,
    productTitle: data.content?.title || undefined,
    productCategory: data.category || undefined,
    productSubcategory: data.subcategory || undefined,
  };
}

/**
 * Upload a document to storage and create a record in the database
 */
export async function uploadDocument(document: {
  file: File;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  companyId?: string;
  contentId?: string;
  productCategory?: string;
  productSubcategory?: string;
}) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Upload file to storage
    const fileExt = document.file.name.split(".").pop();
    const filePath = `documents/${user.id}/${Date.now()}.${fileExt}`;
    const fileSize = (document.file.size / (1024 * 1024)).toFixed(2) + " MB";

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, document.file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: document.title,
        description: document.description || null,
        file_type: fileExt || "unknown",
        category: document.category,
        file_size: fileSize,
        version: "1.0",
        file_path: filePath,
        uploaded_by: user.id,
        // Add linking fields
        company_id: document.companyId || null,
        content_id: document.contentId || null,
        category: document.productCategory || null,
        subcategory: document.productSubcategory || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Add tags if provided
    if (document.tags && document.tags.length > 0) {
      const tagInserts = document.tags.map((tag) => ({
        document_id: data.id,
        tag,
      }));

      const { error: tagError } = await supabase
        .from("document_tags")
        .insert(tagInserts);

      if (tagError) throw tagError;
    }

    return data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

/**
 * Delete a document and its tags
 */
export async function deleteDocument(id: string) {
  try {
    // Get document to find file path
    const { data: document } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", id)
      .single();

    if (document?.file_path) {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([document.file_path]);

      if (storageError) throw storageError;
    }

    // Delete document record (tags will be deleted via cascade)
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
