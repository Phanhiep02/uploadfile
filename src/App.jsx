import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      images: [],
      categoryId: 1,
      orderNum: 1,
    },
  ]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isImageFile = (file) => {
    return file && file.type.startsWith("image/");
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!isImageFile(selectedFile)) {
      setError("vui lòng chọn file là ảnh");
      setImage(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    selectedFile.preview = previewUrl;

    setImage(selectedFile);
    setError("");
  };

  const handleUpload = async () => {
    const productId = 1;

    if (!image) return;

    const currentImages = products[0].images;

    if (currentImages.length >= 3) {
      setError("Bạn chỉ có thể tải lên tối đa 3 ảnh.");
      return;
    }

    setLoading(true);

    const fakeImageUrl = URL.createObjectURL(image);

    try {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: [...currentImages, fakeImageUrl],
          }),
        }
      );

      if (response.ok) {
        // Cập nhật state sản phẩm với ảnh mới
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, images: [...product.images, fakeImageUrl] }
              : product
          )
        );
      } else {
        setError("Có lỗi khi tải ảnh lên.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Không thể kết nối tới API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (image && image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <div>Chọn ảnh (tối đa 3 ảnh)</div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {image && image.preview && <img src={image.preview} alt="Preview" />}

      <button
        onClick={handleUpload}
        disabled={loading || products[0].images.length >= 3}
      >
        {loading ? "Đang tải lên..." : "Tải lên"}
      </button>

      <div>
        <h4>Ảnh hiện tại:</h4>
        {products[0].images.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Ảnh ${index + 1}`}
            style={{ width: "100px", marginRight: "10px" }}
          />
        ))}
      </div>
    </div>
  );
}
