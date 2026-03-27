import { supabase } from '../db/client';

export const StorageService = {
  /**
   * Upload a PDF file to the 'policies' bucket
   */
  async uploadPolicyPdf(file: File, slug: string): Promise<string> {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${slug}-${Date.now()}.${fileExt}`;
    const filePath = `pdfs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('policies')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('policies')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Delete a file from the 'policies' bucket
   */
  async deleteFile(url: string): Promise<void> {
    try {
      // Extract path from URL
      // Correct URL format: https://.../storage/v1/object/public/policies/pdfs/filename.pdf
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/policies/');
      if (pathParts.length < 2) return;
      
      const filePath = pathParts[1];
      const { error } = await supabase.storage
        .from('policies')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Delete file from storage failed:', error);
    }
  }
};
