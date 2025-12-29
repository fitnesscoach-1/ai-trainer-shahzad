import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import api from "../api/axios";
import "./Profile.css";

interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  zip_code: string;
  profile_image?: string;
}

const FITNESS_IMAGE =
  "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=80";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    const res = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    if (!user) return;

    try {
      await api.put("/me", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      loadProfile();
    } catch {
      alert("Failed to update profile. Please try again.");
    }
  };

  /* ================= IMAGE SELECT ================= */
  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;

    const compressed = await imageCompression(e.target.files[0], {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(compressed);
  };

  /* ================= CROP ================= */
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  };

  /* ================= FIXED CROP IMAGE ================= */
  const createCroppedImage = async () => {
  if (!imageSrc || !croppedArea) return;

  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";

  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
  });

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = document.createElement("canvas");
  canvas.width = croppedArea.width;
  canvas.height = croppedArea.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // ✅ white background to avoid dark image
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    croppedArea.x * scaleX,
    croppedArea.y * scaleY,
    croppedArea.width * scaleX,
    croppedArea.height * scaleY,
    0,
    0,
    croppedArea.width,
    croppedArea.height
  );

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(
      (b) => resolve(b as Blob),
      "image/jpeg",
      0.95
    )
  );

  setPreviewImage(URL.createObjectURL(blob));
  setImageSrc(null);
};


  /* ================= UPLOAD IMAGE ================= */
  const uploadCroppedImage = async () => {
    if (!previewImage) return;

    setUploadingImage(true);

    const blob = await fetch(previewImage).then((r) => r.blob());
    const formData = new FormData();

    // ✅ EXACT MATCH WITH FASTAPI
    formData.append("file", blob, "profile.jpg");

    try {
      await api.post("/me/profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPreviewImage(null);
      loadProfile();
    } catch (err: any) {
      console.error("IMAGE UPLOAD ERROR:", err.response?.data || err);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) return <div className="center">Loading...</div>;

   console.log("PROFILE IMAGE URL:", user.profile_image);


  return (
    <div className="profile-wrapper">
      <div className="profile-layout">
        {/* LEFT CARD */}
        <div className="profile-card">
          <div className="avatar-wrapper">
          <img
  className="profile-avatar"
  src={
    previewImage ||
    (user.profile_image
      ? `http://127.0.0.1:8000${user.profile_image}?t=${Date.now()}`
      : "/avatar.png")
  }
  alt="Profile"
/>


            <label className="avatar-edit">
              Change
              <input type="file" hidden onChange={handleImageSelect} />
            </label>
          </div>

          <div className="profile-details">
            {[
              "first_name",
              "last_name",
              "username",
              "email",
              "phone",
              "country",
              "zip_code",
            ].map((f) => (
              <input
                key={f}
                name={f}
                value={(user as any)[f] || ""}
                disabled={!editMode || f === "email"}
                onChange={handleChange}
                placeholder={f.replace("_", " ")}
              />
            ))}
          </div>

          <div className="profile-actions">
            {editMode ? (
              <button onClick={saveProfile}>Save</button>
            ) : (
              <button onClick={() => setEditMode(true)}>Edit</button>
            )}
            <button className="secondary">Reset Password</button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="profile-image-large">
          <img src={FITNESS_IMAGE} alt="Fitness & Healthy Diet" />
        </div>
      </div>

      {/* CROP / PREVIEW MODAL */}
      {(imageSrc || previewImage) && (
        <div className="overlay">
          <div className="modal">
            {imageSrc ? (
              <>
                <Cropper
                  image={imageSrc}
                  crop={{ x: 0, y: 0 }}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={() => {}}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />

                <div className="profile-actions">
                  <button onClick={createCroppedImage}>Preview</button>
                  <button onClick={() => setImageSrc(null)}>Close</button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={previewImage!}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />

                <div className="profile-actions">
                  <button onClick={uploadCroppedImage}>
                    {uploadingImage ? "Uploading..." : "Save Image"}
                  </button>
                  <button onClick={() => setPreviewImage(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
