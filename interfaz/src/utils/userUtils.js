export const fetchUserDataUsingToken = async () => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    throw new Error("No token found");
  }

  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    return JSON.parse(storedUserData);
  }

  try {
    const response = await fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const userData = {
      id: data.id,
      user: data.user,
      avatar: data.avatar,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    return userData;
  } catch (error) {
    throw new Error(error.message);
  }
};
