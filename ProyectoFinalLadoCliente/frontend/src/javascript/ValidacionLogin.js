function ValidacionUsuario(valores) {
  let errores = {};

  // Validación básica de correo para MongoDB
  if (!valores.correo || !valores.correo.includes('@')) {
    errores.correo = "Correo electrónico inválido";
  }

  // Validación básica de contraseña para MongoDB
  if (!valores.contrasena || valores.contrasena.length < 6) {
    errores.contrasena = "La contraseña debe tener al menos 6 caracteres";
  }

  return errores;
}

export default ValidacionUsuario;