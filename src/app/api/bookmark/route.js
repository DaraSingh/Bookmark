// app/api/bookmarks/route.js
import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

import { getServerSession } from "next-auth/next"; // 1. Add this import
import { authOptions } from "../auth/[...nextauth]/route"; // 2. Import your options

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user and only select the bookmarks field
  const user = await User.findOne({ email: session.user.email }).select(
    "bookmarks",
  );
  // console.log(user)

  return Response.json(user.bookmarks || []);
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the body sent from the frontend
    const { title, url } = await req.json();

    if (!title || !url) {
      return Response.json(
        { error: "Title and URL are required" },
        { status: 400 },
      );
    }
    // 3. Update the user by pushing the new bookmark into the array
    // { new: true } returns the updated document after the push
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { bookmarks: { title, url } } },
      { new: true },
    );

    // 4. Return the updated list of bookmarks to the frontend
    return Response.json(updatedUser.bookmarks, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
// ... keep your GET and POST functions ...

export async function DELETE(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // Grab the ID from the URL query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return Response.json({ error: "ID required" }, { status: 400 });

    // Remove the specific bookmark from the array using $pull
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { bookmarks: { _id: id } } },
      { new: true },
    );

    return Response.json(updatedUser.bookmarks);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
