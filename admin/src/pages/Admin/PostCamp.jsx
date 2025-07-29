import React, { useState } from "react";
import axios from "axios";

const PostCamp = () => {
  const [form, setForm] = useState({
    docId: "",
    title: "",
    message: "",
    startDate: "",
    endDate: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append("image", image);

    try {
      const { data } = await axios.post("http://localhost:5000/api/user/post-camp", formData);
      alert(data.message);
    } catch (err) {
      alert("Error posting camp");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      {["docId", "title", "message", "startDate", "endDate"].map((key) => (
        <input
          key={key}
          type={key.includes("Date") ? "date" : "text"}
          name={key}
          placeholder={key}
          onChange={handleChange}
          required
          className="block border p-2 mb-2 w-full"
        />
      ))}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      <button className="bg-blue-500 text-white p-2 mt-2 w-full">Submit</button>
    </form>
  );
};

export default PostCamp;
