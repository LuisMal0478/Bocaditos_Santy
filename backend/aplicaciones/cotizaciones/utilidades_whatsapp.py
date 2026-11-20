"""Utilidades para la generación del mensaje y enlace oficial a WhatsApp."""
import urllib.parse
from aplicaciones.negocio.models import ConfiguracionNegocio

def formatear_numero_whatsapp(numero_crudo):
    """Limpia caracteres no numéricos dejando el formato internacional sin signos."""
    if not numero_crudo:
        return "573000000000"
    limpio = ''.join(c for c in numero_crudo if c.isdigit())
    # Si tiene 10 dígitos (Colombia sin prefijo), agregar prefijo 57
    if len(limpio) == 10:
        limpio = f"57{limpio}"
    return limpio

def generar_mensaje_whatsapp(cotizacion, detalles):
    """
    Construye un mensaje ordenado, claro y profesional para enviar por WhatsApp.
    """
    configuracion = ConfiguracionNegocio.obtener_configuracion()
    encabezado = configuracion.mensaje_bienvenida_whatsapp or "¡Hola Bocaditos Santy! Deseo solicitar una cotización:"

    lineas = [
        f"🌸 *BOCADITOS SANTY - Momentos felices* 🌸",
        encabezado,
        "",
        f"📋 *DATOS DE LA SOLICITUD:*",
        f"• Código: *{cotizacion.codigo_seguimiento}*",
        f"• Cliente: {cotizacion.nombre_cliente}",
        f"• Teléfono: {cotizacion.telefono_whatsapp}",
        f"• Evento: {cotizacion.tipo_evento}",
        f"• Fecha del evento: {cotizacion.fecha_evento.strftime('%d/%m/%Y')}",
    ]

    if cotizacion.lugar_evento:
        lineas.append(f"• Lugar: {cotizacion.lugar_evento}")
    if cotizacion.cantidad_invitados:
        lineas.append(f"• Invitados aproximados: {cotizacion.cantidad_invitados}")

    lineas.append("")
    lineas.append(f"🧁 *PRODUCTOS SELECCIONADOS ({len(detalles)} item{'s' if len(detalles) > 1 else ''}):*")

    subtotal_general = 0
    tiene_precios_pendientes = False

    for indice, det in enumerate(detalles, start=1):
        linea_item = f"*{indice}. {det.nombre_producto_historico}*"
        lineas.append(linea_item)
        lineas.append(f"   • Presentación: {det.nombre_presentacion_historico} ({det.total_unidades_calculadas} unid en total)")
        
        if det.nombre_variante_historico:
            lineas.append(f"   • Opción / Sabor: {det.nombre_variante_historico}")

        lineas.append(f"   • Cantidad solicitada: {det.cantidad_presentaciones} paquete(s) / presentación(es)")

        if det.tipo_precio_historico == 'FIJO' and det.estado_verificacion_historico == 'CONFIRMADO' and det.subtotal_estimado_historico is not None:
            lineas.append(f"   • Precio ref: ${det.subtotal_estimado_historico:,.0f} COP")
            subtotal_general += det.subtotal_estimado_historico
        else:
            lineas.append("   • Precio: Sujeto a cotización")
            tiene_precios_pendientes = True

        if det.observaciones_detalle:
            lineas.append(f"   • Nota: {det.observaciones_detalle}")

    lineas.append("")
    if tiene_precios_pendientes or subtotal_general == 0:
        lineas.append("📌 *Total estimado:* Sujeto a cotización formal según productos y volumen.")
    else:
        lineas.append(f"💰 *Total estimado de referencia:* ${subtotal_general:,.0f} COP (sujeto a confirmación de disponibilidad)")

    if cotizacion.observaciones:
        lineas.append("")
        lineas.append(f"📝 *OBSERVACIONES ADICIONALES:*")
        lineas.append(cotizacion.observaciones)

    lineas.append("")
    lineas.append("Quedo muy atento(a) a su respuesta y confirmación de disponibilidad. ¡Muchas gracias! ✨")

    texto_completo = "\n".join(lineas)
    
    numero_destino = formatear_numero_whatsapp(configuracion.numero_whatsapp)
    texto_codificado = urllib.parse.quote(texto_completo)
    url_whatsapp = f"https://api.whatsapp.com/send?phone={numero_destino}&text={texto_codificado}"

    return texto_completo, url_whatsapp

