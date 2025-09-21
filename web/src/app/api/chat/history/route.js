import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get chat history for the user, ordered by most recent first
    const chatHistory = await sql`
      SELECT id, message, response, created_at
      FROM chat_messages 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return Response.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return Response.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const chatId = searchParams.get("chatId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    if (chatId) {
      // Delete specific chat message
      await sql`
        DELETE FROM chat_messages 
        WHERE id = ${chatId} AND user_id = ${userId}
      `;
    } else {
      // Delete all chat history for user
      await sql`
        DELETE FROM chat_messages 
        WHERE user_id = ${userId}
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat history:", error);
    return Response.json({ error: "Failed to delete chat history" }, { status: 500 });
  }
}