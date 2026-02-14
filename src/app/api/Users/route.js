import User from "@/models/User";
import dbConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth/next"; // 1. Add this import
import { authOptions } from "../auth/[...nextauth]/route"; // 2. Import your options

export async function POST() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const newUser = await User.findOneAndUpdate(
      { email: session.user.email }, // Filter
      { 
        $setOnInsert: { // Only set these fields if creating a NEW user
          name: session.user.name,
          email: session.user.email,
          bookmarks: [] 
        } 
      },
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );
    return Response.json(newUser, { status: 201 });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Hi")
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const users = await User.find();

    return Response.json(users);

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
