export const setAuth = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuth = () => {
  // const auth = useAuth("auth");
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

export const getToken = () => {
  const auth = getAuth();
  return auth?.token || null;
};

export const getAccess = () => {
  const auth = getAuth();
  return auth?.user?.access || [];
};
