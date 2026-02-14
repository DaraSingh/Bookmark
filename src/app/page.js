"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect ,useState} from "react";
export default function Home() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  // const [bookmarkData,setbookmarkData]=useState();
  const [formData, setFormData] = useState({ title: "", url: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
  const res = await fetch(`/api/bookmark?id=${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    // Remove the deleted item from the UI immediately
    setBookmarks(bookmarks.filter((bm) => bm._id !== id));
  }
};

  // 2. Logic to Add Bookmark
  const handleAddBookmark = async () => {
    if (!formData.title || !formData.url) return alert("Please fill both fields");

    const res = await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedBookmarks = await res.json();
      setBookmarks(updatedBookmarks); // Update list immediately
      setFormData({ title: "", url: "" }); // Clear inputs
    }
  };
  useEffect(() => {
    if (session) {
      const fetchBookmark = async () => {
        const res = await fetch("/api/bookmark");
        const data = await res.json();
        setBookmarks(data);
      };
      fetchBookmark();
      fetch("/api/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
        }),
      });
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-amber-100 via-green-300 to-amber-500">
        <Link href="/login">
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition text-5xl">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-indigo-600">Bookmark 🚀</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {session.user.name} 🎉
        </h2>
        <p className="text-gray-600 max-w-xl">
          You have successfully logged in using Google Authentication. This is
          your protected dashboard page built with Next.js.
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* SECTION: ADD NEW BOOKMARK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 p-1 rounded-md">
              ＋
            </span>
            Add New Bookmark
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Website Name (e.g. Google)"
              name="title"
              id="title"
              onChange={handleChange}
              className="text-black p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <input
              type="text"
              placeholder="URL (https://...)"
              name="url"
              id="url"
              onChange={handleChange}
              className="text-black p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="mt-4 w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95" onClick={handleAddBookmark}>
            Add Bookmark
          </button>
        </div>

        {/* SECTION: BOOKMARK LIST */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">
            Your Saved Links
          </h2>

          {/* Example Bookmark Item */}

          {bookmarks.map((bm)=>(
          
          <div key={bm._id} className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-grow">
            <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
            {bm.title}
            </h3>
            <p className="text-sm text-gray-500 truncate max-w-xs md:max-w-md">
            {bm.url}
            </p>
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200" onClick={() => handleDelete(bm._id)}>
            <span>🗑️</span> Delete
            </button>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}