function ValidacionContacto(valores) {
  let errores = {};

  // Validación básica de correo
  if (!valores.correo || !valores.correo.includes('@')) {
    errores.correo = "Ingrese un correo válido";
  }

  // Validación básica de mensaje
  if (!valores.contacto || valores.contacto.trim().length < 5) {
    errores.contacto = "El mensaje debe tener al menos 5 caracteres";
  }

  return errores;
}

export default ValidacionContacto;