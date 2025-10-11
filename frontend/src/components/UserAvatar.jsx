function UserAvatar({ name, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />
    );
  }

  // Si no hay imagen, mostramos inicial
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
      {initial}
    </div>
  );
}

export default UserAvatar;
