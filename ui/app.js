/* ================================================================
   MdLd app.js — toda la lógica de la interfaz
================================================================ */

/* ── i18n ──────────────────────────────────────────────────── */
var I18N={
es:{tab_downloads:'Descargas',tab_settings:'Ajustes',tab_reencode:'Recodificar',lbl_url:'URL de descarga',lbl_title:'Título del video',ph_title:'Nombre personalizado...',lbl_format:'Formato',fmt_loading:'Buscando calidades...',fmt_best_mp4:'Mejor calidad (MP4)',fmt_best_any:'Mejor calidad (sin restricción)',fmt_audio_m4a:'Solo audio (M4A)',fmt_audio_mp3:'Solo audio (MP3)',fmt_custom:'Personalizado...',lbl_custom_fmt:'Cadena de formato yt-dlp',ph_custom_fmt:'ej. bestvideo[vcodec=av01]+bestaudio',lbl_audio_only:'Solo audio',lbl_audio_format:'Formato',lbl_audio_quality:'Calidad',btn_add:'+ Agregar a cola',lbl_reencode:'Recodificar',lbl_container:'Contenedor',lbl_ext:'Extensión',lbl_other:'Otro...',lbl_vcodec:'Códec de video',lbl_copy:'Copiar (sin recodificar)',lbl_novideo:'Sin video (-vn)',lbl_resolution:'Resolución',lbl_original:'Original',lbl_acodec:'Códec de audio',lbl_noaudio:'Sin audio (-an)',lbl_abitrate:'Bitrate de audio',lbl_auto:'Auto',lbl_trim_start:'Inicio de recorte',lbl_trim_end:'Fin de recorte',lbl_extra_args:'Args FFmpeg extra',lbl_local_file:'Archivo local',lbl_drop_or_click:'Arrastra un archivo aquí',lbl_re_output:'Carpeta de salida',btn_browse:'Buscar',lbl_queue:'Cola',btn_all_resolve:'Todo a Resolve',btn_clear:'Limpiar',drop_here:'Suelta aquí para recodificar',drop_files_here:'Arrastra archivos aquí',drop_files_desc:'Video, audio, imágenes — cualquier formato',btn_browse_files:'Buscar archivos',cfg_output_settings:'Configuración de salida',status_connect_davinci:'Conectar con DaVinci',status_connected:'Conectado con DaVinci',dep_ytdlp_missing:'yt-dlp no instalado',dep_ffmpeg_missing:'FFmpeg no encontrado',btn_settings_short:'Ajustes',cfg_output_folder:'Carpeta de salida',btn_change:'Cambiar',cfg_language:'Idioma',cfg_language_select:'Seleccionar idioma',cfg_update_ytdlp:'Actualizar yt-dlp',btn_update:'Actualizar',cfg_verify_ffmpeg:'Verificar instalación',btn_verify:'Verificar',cfg_install_ffmpeg:'Instalar / actualizar FFmpeg',btn_install_winget:'Instalar con winget',btn_web:'Sitio oficial',lbl_output:'Salida del proceso',btn_clear_log:'Limpiar',cfg_personalization:'Personalización',cfg_theme:'Tema base',cfg_custom_colors:'Colores personalizados',cfg_accent:'Acento',cfg_background:'Fondo',cfg_surface:'Superficie',cfg_border:'Borde',cfg_text:'Texto',cfg_hover:'Hover',cfg_active_hl:'Highlight activo',cfg_toggle_dot:'Círculo de switch',cfg_bg_grid:'Fondo y cuadrícula',cfg_dot_grid:'Cuadrícula de puntos',cfg_dot_color:'Color / opacidad cuadrícula',cfg_bg_image:'URL imagen de fondo',cfg_bg_image_hint:'Dejar vacío para quitar',cfg_bg_opacity:'Opacidad de imagen',cfg_bg_blur_img:'Desenfoque de imagen',cfg_bg_zoom:'Zoom de imagen',cfg_bg_position:'Posición de imagen',cfg_bg_position_desc:'Ajusta posición horizontal y vertical',btn_adjust_position:'Ajustar posición',cfg_ui_effect:'Efecto de interfaz',cfg_glass_blur:'Desenfoque de interfaz',cfg_glass_blur_desc:'Aplica blur a paneles y superficies',cfg_glass_opacity:'Opacidad de superficies',cfg_glass_opacity_desc:'Transparencia de paneles',cfg_border_radius:'Radio de bordes',cfg_radius_desc:'Redondez de esquinas',btn_export_theme:'Exportar .mmtheme',btn_import_theme:'Importar .mmtheme',btn_reset:'Restablecer',btn_done:'Listo',cfg_adjust_position:'Posición de imagen',cfg_about:'Acerca de',about_desc:'Descargador y recodificador para editores.\nIntegración con DaVinci Resolve vía API oficial.\nPowered by yt-dlp + FFmpeg.',pending:'Pendiente',downloading:'Descargando',reencoding:'Recodificando',done:'Listo',error:'Error',btn_resolve:'Resolve',btn_open:'Abrir',btn_retry:'Reintentar',msg_added:'Agregado a la cola',msg_sent_resolve:'Enviado al Media Pool',msg_error_resolve:'Error al enviar a Resolve',msg_no_url:'Ingresa al menos una URL',msg_folder_updated:'Carpeta actualizada',msg_ytdlp_updated:'yt-dlp actualizado',msg_ytdlp_error:'Error al actualizar yt-dlp',msg_file_added:'Archivo agregado a la cola',msg_file_error:'Error al agregar el archivo',msg_winget:'Terminal abierta con winget',msg_all_sent:'al Media Pool',msg_none_ready:'No hay archivos listos',btn_compact:'Compacto',btn_exit_compact:'Salir',lbl_cookies:'Cookies',lbl_cookies_set:'Cookies configuradas',lbl_no_cookies:'Sin cookies',btn_set_cookies:'Configurar cookies',btn_save_theme:'Guardar',ph_theme_name:'Nombre del tema...',msg_theme_saved:'Tema guardado',lbl_quick_folder:'Carpeta rápida',ph_folder_path:'Ruta de carpeta...',lbl_recent:'Recientes',lbl_dl_thumbnail:'Descargar miniatura',cfg_advanced_reencode:'Modo avanzado de recodificación',cfg_advanced_reencode_desc:'Permite combinaciones sin restricciones (ej. mp3→png)'},
en:{tab_downloads:'Downloads',tab_settings:'Settings',tab_reencode:'Reencode',lbl_url:'Download URL',lbl_title:'Video title',ph_title:'Custom name...',lbl_format:'Format',fmt_loading:'Fetching qualities...',fmt_best_mp4:'Best quality (MP4)',fmt_best_any:'Best quality (any)',fmt_audio_m4a:'Audio only (M4A)',fmt_audio_mp3:'Audio only (MP3)',fmt_custom:'Custom...',lbl_custom_fmt:'yt-dlp format string',ph_custom_fmt:'e.g. bestvideo[vcodec=av01]+bestaudio',lbl_audio_only:'Audio only',lbl_audio_format:'Format',lbl_audio_quality:'Quality',btn_add:'+ Add to queue',lbl_reencode:'Reencode',lbl_container:'Container',lbl_ext:'Extension',lbl_other:'Other...',lbl_vcodec:'Video codec',lbl_copy:'Copy (no reencode)',lbl_novideo:'No video (-vn)',lbl_resolution:'Resolution',lbl_original:'Original',lbl_acodec:'Audio codec',lbl_noaudio:'No audio (-an)',lbl_abitrate:'Audio bitrate',lbl_auto:'Auto',lbl_trim_start:'Trim start',lbl_trim_end:'Trim end',lbl_extra_args:'Extra FFmpeg args',lbl_local_file:'Local file',lbl_drop_or_click:'Drop a file here',lbl_re_output:'Output folder',btn_browse:'Browse',lbl_queue:'Queue',btn_all_resolve:'All to Resolve',btn_clear:'Clear done',drop_here:'Drop here to reencode',drop_files_here:'Drop files here',drop_files_desc:'Video, audio, images — any format',btn_browse_files:'Browse files',cfg_output_settings:'Output settings',status_connect_davinci:'Connect to DaVinci',status_connected:'Connected to DaVinci',dep_ytdlp_missing:'yt-dlp not installed',dep_ffmpeg_missing:'FFmpeg not found',btn_settings_short:'Settings',cfg_output_folder:'Output folder',btn_change:'Change',cfg_language:'Language',cfg_language_select:'Select language',cfg_update_ytdlp:'Update yt-dlp',btn_update:'Update',cfg_verify_ffmpeg:'Verify installation',btn_verify:'Verify',cfg_install_ffmpeg:'Install / update FFmpeg',btn_install_winget:'Install with winget',btn_web:'Official site',lbl_output:'Process output',btn_clear_log:'Clear',cfg_personalization:'Personalization',cfg_theme:'Base theme',cfg_custom_colors:'Custom colors',cfg_accent:'Accent',cfg_background:'Background',cfg_surface:'Surface',cfg_border:'Border',cfg_text:'Text',cfg_hover:'Hover',cfg_active_hl:'Active highlight',cfg_toggle_dot:'Toggle dot',cfg_bg_grid:'Background & grid',cfg_dot_grid:'Dot grid',cfg_dot_color:'Grid color / opacity',cfg_bg_image:'Background image URL',cfg_bg_image_hint:'Leave empty to remove',cfg_bg_opacity:'Image opacity',cfg_bg_blur_img:'Image blur',cfg_bg_zoom:'Image zoom',cfg_bg_position:'Image position',cfg_bg_position_desc:'Adjust horizontal and vertical position',btn_adjust_position:'Adjust position',cfg_ui_effect:'Interface effect',cfg_glass_blur:'Interface blur',cfg_glass_blur_desc:'Applies blur to panels and surfaces',cfg_glass_opacity:'Surface opacity',cfg_glass_opacity_desc:'Panel transparency',cfg_border_radius:'Border radius',cfg_radius_desc:'Corner roundness',btn_export_theme:'Export .mmtheme',btn_import_theme:'Import .mmtheme',btn_reset:'Reset',btn_done:'Done',cfg_adjust_position:'Image position',cfg_about:'About',about_desc:'Downloader and re-encoder for editors.\nDirect DaVinci Resolve integration via official API.\nPowered by yt-dlp + FFmpeg.',pending:'Pending',downloading:'Downloading',reencoding:'Reencoding',done:'Done',error:'Error',btn_resolve:'Resolve',btn_open:'Open',btn_retry:'Retry',msg_added:'Added to queue',msg_sent_resolve:'Sent to Media Pool',msg_error_resolve:'Failed to send to Resolve',msg_no_url:'Enter at least one URL',msg_folder_updated:'Folder updated',msg_ytdlp_updated:'yt-dlp updated',msg_ytdlp_error:'Failed to update yt-dlp',msg_file_added:'File added to queue',msg_file_error:'Failed to add file',msg_winget:'Terminal opened',msg_all_sent:'to Media Pool',msg_none_ready:'No files ready',btn_compact:'Compact',btn_exit_compact:'Exit',lbl_cookies:'Cookies',lbl_cookies_set:'Cookies set',lbl_no_cookies:'No cookies',btn_set_cookies:'Set cookies',btn_save_theme:'Save',ph_theme_name:'Theme name...',msg_theme_saved:'Theme saved',lbl_quick_folder:'Quick folder',ph_folder_path:'Folder path...',lbl_recent:'Recent',lbl_dl_thumbnail:'Download thumbnail',cfg_advanced_reencode:'Advanced reencode mode',cfg_advanced_reencode_desc:'Allow unusual combinations (e.g. mp3→png)'},
hi:{tab_downloads:'Downloads',tab_settings:'Settings',tab_reencode:'Reencode',lbl_url:'Video ka URL daalo',lbl_title:'Video ka naam',ph_title:'Custom naam...',lbl_format:'Format',fmt_loading:'Qualities dhundh raha hai...',fmt_best_mp4:'Best quality (MP4)',fmt_best_any:'Best quality (koi bhi)',fmt_audio_m4a:'Sirf audio (M4A)',fmt_audio_mp3:'Sirf audio (MP3)',fmt_custom:'Custom...',lbl_custom_fmt:'yt-dlp format string',ph_custom_fmt:'jaise: bestvideo[vcodec=av01]+bestaudio',lbl_audio_only:'Sirf audio',lbl_audio_format:'Format',lbl_audio_quality:'Quality',btn_add:'+ Queue mein daalo',lbl_reencode:'Reencode karo',lbl_container:'Container',lbl_ext:'Extension',lbl_other:'Kuch aur...',lbl_vcodec:'Video codec',lbl_copy:'Copy (reencode nahi)',lbl_novideo:'Video nahi (-vn)',lbl_resolution:'Resolution',lbl_original:'Original',lbl_acodec:'Audio codec',lbl_noaudio:'Audio nahi (-an)',lbl_abitrate:'Audio bitrate',lbl_auto:'Auto',lbl_trim_start:'Shuru se kaat',lbl_trim_end:'Khatam tak kaat',lbl_extra_args:'Extra FFmpeg args',lbl_local_file:'Local file',lbl_drop_or_click:'File yahan drop karo',lbl_re_output:'Output folder',btn_browse:'Dhundho',lbl_queue:'Queue',btn_all_resolve:'Sab Resolve mein',btn_clear:'Clear karo',drop_here:'Reencode ke liye drop karo',drop_files_here:'Files yahan drop karo',drop_files_desc:'Video, audio, images — koi bhi format',btn_browse_files:'Files dhundho',cfg_output_settings:'Output settings',status_connect_davinci:'DaVinci se connect karo',status_connected:'DaVinci se connected hai',dep_ytdlp_missing:'yt-dlp install nahi hai',dep_ffmpeg_missing:'FFmpeg nahi mila',btn_settings_short:'Settings',cfg_output_folder:'Output folder',btn_change:'Badlo',cfg_language:'Language',cfg_language_select:'Language chuno',cfg_update_ytdlp:'yt-dlp update karo',btn_update:'Update',cfg_verify_ffmpeg:'Installation check karo',btn_verify:'Check karo',cfg_install_ffmpeg:'FFmpeg install / update karo',btn_install_winget:'winget se install',btn_web:'Official site',lbl_output:'Output',btn_clear_log:'Clear',cfg_personalization:'Personalization',cfg_theme:'Base theme',cfg_custom_colors:'Custom colors',cfg_accent:'Accent',cfg_background:'Background',cfg_surface:'Surface',cfg_border:'Border',cfg_text:'Text',cfg_hover:'Hover',cfg_active_hl:'Active highlight',cfg_toggle_dot:'Toggle dot',cfg_bg_grid:'Background aur grid',cfg_dot_grid:'Dot grid',cfg_dot_color:'Grid ka color / opacity',cfg_bg_image:'Background image URL',cfg_bg_image_hint:'Hatane ke liye khali chhoddo',cfg_bg_opacity:'Image opacity',cfg_bg_blur_img:'Image blur',cfg_bg_zoom:'Image zoom',cfg_bg_position:'Image position',cfg_bg_position_desc:'Horizontal aur vertical position',btn_adjust_position:'Position theek karo',cfg_ui_effect:'Interface effect',cfg_glass_blur:'Interface blur',cfg_glass_blur_desc:'Blur on panels',cfg_glass_opacity:'Surface opacity',cfg_glass_opacity_desc:'Panel transparency',cfg_border_radius:'Border radius',cfg_radius_desc:'Corner roundness',btn_export_theme:'Export .mmtheme',btn_import_theme:'Import .mmtheme',btn_reset:'Reset karo',btn_done:'Ho gaya',cfg_adjust_position:'Image position',cfg_about:'About',about_desc:'Editors ke liye downloader aur re-encoder.\nDaVinci Resolve ke saath directly kaam karta hai.\nyt-dlp + FFmpeg se powered.',pending:'Pending',downloading:'Download ho raha hai',reencoding:'Reencode ho raha hai',done:'Ho gaya',error:'Error aaya',btn_resolve:'Resolve',btn_open:'Kholo',btn_retry:'Dobara try karo',msg_added:'Queue mein add ho gaya',msg_sent_resolve:'Media Pool mein bheja',msg_error_resolve:'Resolve mein bhejne mein error',msg_no_url:'Kam se kam ek URL daalo',msg_folder_updated:'Folder update ho gaya',msg_ytdlp_updated:'yt-dlp update ho gaya',msg_ytdlp_error:'yt-dlp update nahi hua',msg_file_added:'File queue mein add ho gayi',msg_file_error:'File add nahi hui',msg_winget:'Terminal khul gayi',msg_all_sent:'Media Pool mein',msg_none_ready:'Koi file ready nahi hai',btn_compact:'Compact',btn_exit_compact:'Bahar aao',lbl_cookies:'Cookies',lbl_cookies_set:'Cookies set hai',lbl_no_cookies:'Koi cookies nahi',btn_set_cookies:'Cookies set karo',btn_save_theme:'Save',ph_theme_name:'Theme naam...',msg_theme_saved:'Theme save ho gaya',lbl_quick_folder:'Quick folder',ph_folder_path:'Folder path...',lbl_recent:'Recent',lbl_dl_thumbnail:'Thumbnail download karo',cfg_advanced_reencode:'Advanced reencode mode',cfg_advanced_reencode_desc:'Unusual combos allow karo'}
};
var lang='es';
function t(k){return(I18N[lang]&&I18N[lang][k])||I18N.es[k]||k;}
function applyI18n(){
  document.querySelectorAll('[data-i]').forEach(function(el){
    var k=el.getAttribute('data-i'),v=t(k);
    if(el.tagName!=='INPUT'&&el.tagName!=='TEXTAREA')el.textContent=v;
  });
  document.querySelectorAll('[data-i-ph]').forEach(function(el){el.placeholder=t(el.getAttribute('data-i-ph'));});
  var ua=document.getElementById('url-input');
  if(ua)ua.placeholder=lang==='en'?'One or more URLs (one per line)\nYouTube, Vimeo, TikTok...':lang==='hi'?'Ek ya zyada URLs (ek per line)\nYouTube, Vimeo, TikTok...':'Una o varias URLs (una por línea)\nYouTube, Vimeo, TikTok...';
  // fix import label text node
  document.querySelectorAll('[data-i="btn_import_theme"]').forEach(function(el){
    var txt=t('btn_import_theme');
    if(el.firstChild&&el.firstChild.nodeType===3)el.firstChild.textContent=txt;
    else{var tn=document.createTextNode(txt);el.insertBefore(tn,el.firstChild);}
  });
  // Textarea placeholders
  var ua=document.getElementById('url-input');
  if(ua)ua.placeholder=lang==='en'?'One or more URLs (one per line) — supports multiple platforms':lang==='hi'?'Ek ya zyada URLs (ek per line) — multiple platforms supported':'Una o varias URLs (una por línea) — (Soporta múltiples plataformas)';
}
// ── Apply i18n IMMEDIATELY at load (not waiting for pywebviewready) ──
applyI18n();

function setLang(l){lang=l;applyI18n();pyCall('save_pref','lang',l);cddSet('cdd-lang',l,l==='en'?'English':l==='hi'?'Hinglish':'Español');}

/* ── THEMES ─────────────────────────────────────────────────── */
var THEMES={
  default:{'--ac':'#f5c842','--acd':'rgba(245,200,66,.12)','--active-hl':'rgba(245,200,66,.12)','--tag-bd':'rgba(245,200,66,.4)','--bg':'#0a0a0a','--sf':'#111111','--sf2':'#181818','--sf3':'#222222','--bd':'#2a2a2a','--bd2':'#3a3a3a','--tx':'#f0f0f0','--tx2':'#888888','--tx3':'#555555'},
  catppuccin:{'--ac':'#cba6f7','--acd':'rgba(203,166,247,.12)','--active-hl':'rgba(203,166,247,.12)','--tag-bd':'rgba(203,166,247,.4)','--bg':'#1e1e2e','--sf':'#181825','--sf2':'#1e1e2e','--sf3':'#2a2739','--bd':'#313244','--bd2':'#45475a','--tx':'#cdd6f4','--tx2':'#a6adc8','--tx3':'#6c7086'},
  rosepine:{'--ac':'#eb6f92','--acd':'rgba(235,111,146,.12)','--active-hl':'rgba(235,111,146,.12)','--tag-bd':'rgba(235,111,146,.4)','--bg':'#191724','--sf':'#1f1d2e','--sf2':'#26233a','--sf3':'#2a2741','--bd':'#403d52','--bd2':'#524f67','--tx':'#e0def4','--tx2':'#908caa','--tx3':'#6e6a86'},
  violet:{'--ac':'#a78bfa','--acd':'rgba(167,139,250,.12)','--active-hl':'rgba(167,139,250,.12)','--tag-bd':'rgba(167,139,250,.4)','--bg':'#0d0d14','--sf':'#13111f','--sf2':'#1a1726','--sf3':'#201d2e','--bd':'#2d2945','--bd2':'#3d3860','--tx':'#e2e0f0','--tx2':'#8b87b8','--tx3':'#5a5680'},
  cyber:{'--ac':'#00fff0','--acd':'rgba(0,255,240,.1)','--active-hl':'rgba(0,255,240,.1)','--tag-bd':'rgba(0,255,240,.35)','--bg':'#080b14','--sf':'#0d1117','--sf2':'#121820','--sf3':'#1a2230','--bd':'#1e2d3d','--bd2':'#2a3f55','--tx':'#e0f0ff','--tx2':'#7090b0','--tx3':'#3a5570'}
};
function applyTheme(name,skipSave){
  var th=THEMES[name]||THEMES.default,root=document.documentElement;
  Object.keys(th).forEach(function(k){root.style.setProperty(k,th[k]);});
  cddSet('cdd-theme',name,name==='default'?'MDowlet Dark':name.charAt(0).toUpperCase()+name.slice(1));
  _computeGlassSf();syncHexInputs();
  if(!skipSave)pyCall('save_pref','theme',name);
}
var _GLASS_SELECTORS=['#topbar','#statusbar','#left-panel','#re-panel','#re-settings-side','#queue-header','#re-inner','#left-inner','#view-cfg-scroll','.s-section'];
function _computeGlassSf(){
  var be=document.getElementById('glass-blur'),oe=document.getElementById('glass-opacity');
  if(!be||!oe)return;
  var blur=parseFloat(be.value||0),op=parseFloat(oe.value||100)/100;
  var sf=getComputedStyle(document.documentElement).getPropertyValue('--sf').trim()||'#111111';
  var r=17,g=17,b=17,m=sf.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if(m){r=parseInt(m[1],16);g=parseInt(m[2],16);b=parseInt(m[3],16);}
  var glassSf='rgba('+r+','+g+','+b+','+op.toFixed(3)+')';
  document.documentElement.style.setProperty('--glass-sf',glassSf);
  document.documentElement.style.setProperty('--glass-blur',blur+'px');
  // Apply directly to each panel element so backdrop-filter actually works
  var blurVal=blur>0?'blur('+blur+'px)':'none';
  _GLASS_SELECTORS.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){
      el.style.background=glassSf;
      el.style.backdropFilter=blurVal;
      el.style.webkitBackdropFilter=blurVal;
    });
  });
}
function applyGlassBlur(v){document.getElementById('glass-blur-val').textContent=v+'px';_computeGlassSf();pyCall('save_pref','glass_blur',v);}
function applyGlassOpacity(v){document.getElementById('glass-opacity-val').textContent=v+'%';_computeGlassSf();pyCall('save_pref','glass_opacity',v);}
function applyRadius(v){document.getElementById('radius-val').textContent=v+'px';document.documentElement.style.setProperty('--r',v+'px');pyCall('save_pref','border_radius',v);}
function _rebuildDotGrid(){
  var hex=document.getElementById('hx-dot').value||'#ffffff';
  var pct=parseInt(document.getElementById('dot-opacity').value||'6');
  var r2=0,g2=0,b2=0;
  try{r2=parseInt(hex.slice(1,3),16)||0;g2=parseInt(hex.slice(3,5),16)||0;b2=parseInt(hex.slice(5,7),16)||0;}catch(e){}
  document.getElementById('dot-grid-el').style.backgroundImage='radial-gradient(circle,rgba('+r2+','+g2+','+b2+','+(pct/100).toFixed(2)+') 1px,transparent 1px)';
}
function toggleDotGrid(el){el.classList.toggle('on');document.getElementById('dot-grid-el').style.display=el.classList.contains('on')?'':'none';pyCall('save_pref','dot_visible',el.classList.contains('on')?'true':'false');}
function applyDotColor(val){val=val.trim();if(!val.startsWith('#'))val='#'+val;if(!/^#[0-9a-fA-F]{6}$/.test(val))return;document.getElementById('hs-dot').style.background=val;_rebuildDotGrid();pyCall('save_pref','dot_color',val);}
function applyDotOpacity(v){document.getElementById('dot-opacity-val').textContent=v+'%';_rebuildDotGrid();pyCall('save_pref','dot_opacity',v);}
var _bgState={bg_opacity:18,bg_blur:0,bg_zoom:100,bg_pos_x:50,bg_pos_y:50,bg_img:''};
function _setBgImg(url){
  var el=document.getElementById('bg-img-el');
  if(url&&url.trim()){el.style.backgroundImage='url('+JSON.stringify(url.trim())+')';el.style.backgroundSize=(_bgState.bg_zoom||100)+'%';el.style.backgroundPosition=(_bgState.bg_pos_x||50)+'% '+(_bgState.bg_pos_y||50)+'%';el.style.opacity=(_bgState.bg_opacity||18)/100;}
  else{el.style.backgroundImage='none';el.style.opacity=0;}
}
function applyBgImg(url){_bgState.bg_img=url;_setBgImg(url);pyCall('save_pref','bg_img',url);}
function applyBgOpacity(v){document.getElementById('bg-opacity-val').textContent=v+'%';_bgState.bg_opacity=parseInt(v);document.getElementById('bg-img-el').style.opacity=v/100;pyCall('save_pref','bg_opacity',v);}
function applyBgBlur(v){document.getElementById('bg-blur-val').textContent=v+'px';document.getElementById('bg-img-el').style.filter='blur('+v+'px)';_bgState.bg_blur=parseInt(v);pyCall('save_pref','bg_blur',v);}
function applyBgZoom(v){document.getElementById('bg-zoom-val').textContent=v+'%';document.getElementById('bg-img-el').style.backgroundSize=v+'%';_bgState.bg_zoom=parseInt(v);pyCall('save_pref','bg_zoom',v);}
function applyBgPos(){
  var x=document.getElementById('bg-pos-x').value,y=document.getElementById('bg-pos-y').value;
  document.getElementById('bg-pos-x-val2').textContent=x+'%';document.getElementById('bg-pos-y-val2').textContent=y+'%';
  document.getElementById('bg-img-el').style.backgroundPosition=x+'% '+y+'%';
  _bgState.bg_pos_x=parseInt(x);_bgState.bg_pos_y=parseInt(y);
  // Save both in one call to avoid race
  pyCall('save_pref','bg_pos_x',String(x));
  pyCall('save_pref','bg_pos_y',String(y));
}
// Show only sliders + background image, hide everything else
function openBgPosOverlay(){
  document.getElementById('bg-pos-overlay').classList.add('show');
  ['topbar','view-dl','view-re','view-cfg','statusbar'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.visibility='hidden';});
}
function closeBgPosOverlay(){
  document.getElementById('bg-pos-overlay').classList.remove('show');
  ['topbar','view-dl','view-re','view-cfg','statusbar'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.visibility='';});
}
function hexInput(key,val){
  val=val.trim();if(!val.startsWith('#'))val='#'+val;if(!/^#[0-9a-fA-F]{6}$/.test(val))return;
  var r2=parseInt(val.slice(1,3),16),g2=parseInt(val.slice(3,5),16),b2=parseInt(val.slice(5,7),16);
  var cssKey='--'+key,cssVal=val;
  if(key==='hover')cssVal='rgba('+r2+','+g2+','+b2+',.07)';
  else if(key==='active'){cssKey='--active-hl';cssVal='rgba('+r2+','+g2+','+b2+',.12)';document.documentElement.style.setProperty('--acd',cssVal);}
  document.documentElement.style.setProperty(cssKey,cssVal);
  var sw=document.getElementById('hs-'+key.replace('--',''));if(sw)sw.style.background=val;
  _computeGlassSf();
  // Also keep --acd in sync when active-hl changes
  if(key==='active'){document.documentElement.style.setProperty('--acd',cssVal);}
  // Collect ALL current custom colors and save as full object
  window._customColors=window._customColors||{};
  window._customColors[cssKey]=cssVal;
  // Also persist acd when ac changes
  if(cssKey==='--ac'){
    var r2=parseInt(cssVal.slice?cssVal.slice(1,3)||'f5':0,16)||245;
    var g2=parseInt(cssVal.slice?cssVal.slice(3,5)||'c8':0,16)||200;
    var b2=parseInt(cssVal.slice?cssVal.slice(5,7)||'42':0,16)||66;
    var acdVal='rgba('+r2+','+g2+','+b2+',.12)';
    document.documentElement.style.setProperty('--acd',acdVal);
    window._customColors['--acd']=acdVal;
  }
  pyCall('save_pref','custom_theme',JSON.stringify(window._customColors));
}
function syncHexInputs(){
  ['ac','bg','sf','bd','tx'].forEach(function(k){var c=getComputedStyle(document.documentElement).getPropertyValue('--'+k).trim();var inp=document.getElementById('hx-'+k),sw=document.getElementById('hs-'+k);if(inp)inp.value=c;if(sw)sw.style.background=c;});
  var hSw=document.getElementById('hs-hover');if(hSw)hSw.style.background='var(--hover)';
  var aSw=document.getElementById('hs-active');if(aSw)aSw.style.background='var(--active-hl)';
  var dSw=document.getElementById('hs-toggle-dot');if(dSw)dSw.style.background=getComputedStyle(document.documentElement).getPropertyValue('--toggle-dot').trim();
}
function resetColors(){applyTheme(cddVal('cdd-theme')||'default',false);pyCall('save_pref','custom_theme','{}');}

/* Named theme save/load */
function saveNamedTheme(){
  var name=document.getElementById('save-theme-name').value.trim();
  if(!name){toast(lang==='en'?'Enter a theme name':'Escribe un nombre','err');return;}
  var th=_buildThemeObj();th.name=name;
  // Also include current custom colors
  th.colors=Object.assign({},th.colors,window._customColors||{});
  var key='user_theme_'+name.replace(/[^a-zA-Z0-9]/g,'_');
  pyCall('save_pref',key,JSON.stringify(th)).then(function(){
    toast(t('msg_theme_saved')+': '+name,'ok');
    document.getElementById('save-theme-name').value='';
    window._namedThemes=window._namedThemes||{};
    window._namedThemes[key]=JSON.stringify(th);
    addThemeOption(key,name);
  });
}
function addThemeOption(val,label){
  var list=document.getElementById('theme-opts-list');if(!list)return;
  // Check if already exists
  var existing=list.querySelector('[data-val="'+val+'"]');
  if(existing)return;
  var d=document.createElement('div');d.className='cdd-opt';d.setAttribute('data-val',val);d.textContent=label;
  d.addEventListener('click',function(){
    list.querySelectorAll('.cdd-opt').forEach(function(x){x.classList.remove('selected');});
    d.classList.add('selected');
    var tv=document.querySelector('#cdd-theme .cdd-val');if(tv)tv.textContent=label;
    document.getElementById('cdd-theme').classList.remove('open');
    // Load theme from prefs
    pyCall('save_pref','theme',val).then(function(){});
    // Apply colors
    try{var raw=window._namedThemes&&window._namedThemes[val];if(raw){var th=JSON.parse(raw);_applyThemeObj&&_applyThemeObj(th);}}catch(e){}
  });
  list.appendChild(d);
}
function loadNamedThemesFromPrefs(prefs){
  window._namedThemes=window._namedThemes||{};
  Object.keys(prefs).forEach(function(k){
    if(k.startsWith('user_theme_')){
      try{
        var raw=typeof prefs[k]==='string'?prefs[k]:JSON.stringify(prefs[k]);
        var th=JSON.parse(raw);
        window._namedThemes[k]=raw;
        addThemeOption(k,th.name||k.replace('user_theme_',''));
      }catch(e){}
    }
  });
  // If current theme is a user theme, apply it
  var cur=prefs.theme||'';
  if(cur.startsWith('user_theme_')&&window._namedThemes[cur]){
    try{
      var th=JSON.parse(window._namedThemes[cur]);
      if(window._applyThemeObj)window._applyThemeObj(th);
    }catch(e){}
  }
}
function toggleCollapsible(id){document.getElementById(id).classList.toggle('open');}
function _buildThemeObj(){
  var CSS_KEYS=['--bg','--sf','--sf2','--sf3','--bd','--bd2','--tx','--tx2','--tx3','--ac','--hover','--active-hl','--tag-bd','--toggle-dot'];
  var th={name:'MdLd Theme',version:'0.1.0',colors:{},bg_img:_bgState.bg_img||'',bg_opacity:_bgState.bg_opacity||18,bg_blur:_bgState.bg_blur||0,bg_zoom:_bgState.bg_zoom||100,bg_pos_x:_bgState.bg_pos_x||50,bg_pos_y:_bgState.bg_pos_y||50,dot_visible:document.getElementById('dot-toggle').classList.contains('on'),dot_color:document.getElementById('hx-dot').value,dot_opacity:parseInt(document.getElementById('dot-opacity').value),glass_blur:parseInt(document.getElementById('glass-blur').value),glass_opacity:parseInt(document.getElementById('glass-opacity').value),border_radius:parseInt(document.getElementById('radius-slider').value)};
  CSS_KEYS.forEach(function(k){th.colors[k]=getComputedStyle(document.documentElement).getPropertyValue(k).trim();});
  return th;
}
function exportTheme(){
  var json=JSON.stringify(_buildThemeObj(),null,2);
  pyCall('export_theme_file',json).then(function(r){
    if(r.ok)toast(lang==='en'?'Theme exported':'Tema exportado','ok');
    else toast(r.error||'Export error','err');
  });
}
window._applyThemeObj=function _applyThemeObj(th){
  if(th.colors)Object.keys(th.colors).forEach(function(k){document.documentElement.style.setProperty(k,th.colors[k]);});
  if(th.border_radius!==undefined){document.getElementById('radius-slider').value=th.border_radius;applyRadius(th.border_radius);}
  if(th.glass_blur!==undefined){document.getElementById('glass-blur').value=th.glass_blur;applyGlassBlur(th.glass_blur);}
  if(th.glass_opacity!==undefined){document.getElementById('glass-opacity').value=th.glass_opacity;applyGlassOpacity(th.glass_opacity);}
  if(th.dot_color){document.getElementById('hx-dot').value=th.dot_color;applyDotColor(th.dot_color);}
  if(th.dot_opacity!==undefined){document.getElementById('dot-opacity').value=th.dot_opacity;applyDotOpacity(th.dot_opacity);}
  _rebuildDotGrid();_computeGlassSf();syncHexInputs();
};
function importTheme(input){
  var file=input.files[0];if(!file)return;
  pyCall('import_theme_file').then(function(r){
    if(!r.ok){toast(lang==='en'?'Cancelled':'Cancelado','inf');input.value='';return;}
    try{
      var th=JSON.parse(r.content);
      if(window._applyThemeObj)window._applyThemeObj(th);
      toast('Tema "'+( th.name||'importado')+'" aplicado','ok');
    }catch(err){toast(lang==='en'?'Invalid file':'Archivo inválido','err');}
    input.value='';
  });
}

/* ── pyCall ──────────────────────────────────────────────────── */
var STATE={queue:[],resolveOk:false,outputDir:'',reOutDir:'',activeView:'dl',reOpen:false,reEnabled:false,audioOnly:false,audioFmt:'mp3',audioBr:'192k',audioSettingsOpen:false,_fetchDuration:0,_fetchThumb:'',_lastFetchUrl:'',_fetchTimer:null};
/* ── QWebChannel bridge ──────────────────────────────────── */
var _api=null;
function pyCall(method){
  var args=Array.prototype.slice.call(arguments,1);
  return new Promise(function(resolve){
    if(!_api){resolve({ok:false,error:'Bridge not ready'});return;}
    var mapped=args.map(function(a){return typeof a==='object'?JSON.stringify(a):String(a);});
    var fn=_api[method];
    if(!fn){resolve({ok:false,error:'Not available: '+method});return;}
    mapped.push(function(r){resolve(typeof r==='string'?JSON.parse(r):r);});
    try{fn.apply(_api,mapped);}catch(e){resolve({ok:false,error:String(e)});}
  });
}
window._onEvent=function(p){
  var ev=p.event,d=p.data;
  if(ev==='item_updated'){
    var found=false;
    for(var i=0;i<STATE.queue.length;i++){if(STATE.queue[i].id===d.id){STATE.queue[i]=d;found=true;break;}}
    if(!found)STATE.queue.push(d);
    smartUpdateItem(d);updateSbInfo();
  }else if(ev==='queue_updated'){STATE.queue=d;renderQueue();updateSbInfo();}
  else if(ev==='log')appendLog(d.target,d.text,d.cls);
  else if(ev==='resolve_update')_applyResolveState(d);
  else if(ev==='dep_status'){
    var ytEl=document.getElementById('dep-ytdlp');
    var ffEl=document.getElementById('dep-ffmpeg');
    if(ytEl)ytEl.style.display=d.yt_dlp?'none':'flex';
    if(ffEl)ffEl.style.display=(d.ffmpeg&&d.ffprobe)?'none':'flex';
    if(window._ytdlpInstalling&&d.yt_dlp){window._ytdlpInstalling();window._ytdlpInstalling=null;}
    var fsp=document.getElementById('ffmpeg-spin');if(fsp&&(d.ffmpeg||d.ffprobe))fsp.style.display='none';
  }
};
function toast(msg,type){var c=document.getElementById('toasts'),el=document.createElement('div');el.className='toast'+(type?' '+type:'');el.textContent=msg;c.appendChild(el);setTimeout(function(){el.style.transition='opacity .22s';el.style.opacity='0';setTimeout(function(){el.remove();},240);},2800);}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

/* ── CDD ─────────────────────────────────────────────────────── */
function cddToggle(id){
  var el=document.getElementById(id),wasOpen=el.classList.contains('open');
  document.querySelectorAll('.cdd.open').forEach(function(x){x.classList.remove('open');});
  if(!wasOpen){
    el.classList.add('open');
    var menu=el.querySelector('.cdd-menu'),rect=el.getBoundingClientRect();
    var w=Math.max(el.offsetWidth,150);
    menu.style.width=w+'px';menu.style.left=rect.left+'px';
    if(rect.bottom+210>window.innerHeight)menu.style.top=(rect.top-210)+'px';
    else menu.style.top=rect.bottom+'px';
  }
}
function cddVal(id){var s=document.querySelector('#'+id+' .cdd-opt.selected');return s?s.getAttribute('data-val'):'';}
function cddSet(id,val,label){document.querySelectorAll('#'+id+' .cdd-opt').forEach(function(o){o.classList.remove('selected');if(o.getAttribute('data-val')===val)o.classList.add('selected');});var trig=document.querySelector('#'+id+' .cdd-val');if(trig&&label)trig.textContent=label;}
function initDropdowns(){
  document.querySelectorAll('.cdd-opt').forEach(function(opt){
    opt.addEventListener('click',function(){
      var cdd=opt.closest('.cdd');
      cdd.querySelectorAll('.cdd-opt').forEach(function(x){x.classList.remove('selected');});
      opt.classList.add('selected');
      var tv=cdd.querySelector('.cdd-val');if(tv)tv.textContent=opt.textContent.trim();
      cdd.classList.remove('open');
      var id=cdd.id,val=opt.getAttribute('data-val');
      if(id==='cdd-dl-format')document.getElementById('custom-fmt-wrap').style.display=val==='custom'?'block':'none';
      if(id==='cdd-out-ext')document.getElementById('out-ext-custom-wrap').style.display=val==='custom'?'block':'none';
      if(id==='cdd-v-codec'){var show=val!=='copy'&&val!=='none'&&val!=='prores_ks'&&val!=='dnxhd'&&val!=='png'&&val!=='libwebp';document.getElementById('crf-row').style.display=show?'block':'none';}
      if(id==='cdd-out-ext'||id==='cdd-re-out-ext')applyContainerCoherence(id,val);
      if(id==='cdd-theme')applyTheme(val);
      if(id==='cdd-lang')setLang(val);
    });
  });
}
document.addEventListener('click',function(e){if(!e.target.closest('.cdd'))document.querySelectorAll('.cdd.open').forEach(function(x){x.classList.remove('open');});});

/* ── Format fetch ─────────────────────────────────────────────── */
var _fmtDebounce=null,_lastFetchUrl='';
function onUrlChange(){
  var first=(document.getElementById('url-input').value.trim().split('\n')[0]||'').trim();
  if(!first){
    STATE._lastFetchUrl='';STATE._fetchDuration=0;STATE._fetchThumb='';
    document.getElementById('trim-section').style.display='none';return;
  }
  if(first===STATE._lastFetchUrl)return;
  clearTimeout(STATE._fetchTimer);
  STATE._fetchTimer=setTimeout(function(){
    if(first===STATE._lastFetchUrl||!window._api)return;
    STATE._lastFetchUrl=first;
    pyCall('fetch_formats',first).then(function(r){
      if(!r||!r.ok)return;
      STATE._fetchThumb=r.thumb||'';
      if(r.duration&&r.duration>0)_showTrimSliders(r.duration);
    });
  },900);
}

function _doFetchFmts(url){
  _lastFetchUrl=url;document.getElementById('fmt-loading').style.display='flex';
  pyCall('fetch_formats',url).then(function(r){
    document.getElementById('fmt-loading').style.display='none';
    if(r.title){document.getElementById('title-row').style.display='block';var ti=document.getElementById('video-title');if(!ti.value)ti.value=r.title;}
    if(!r.ok||!r.heights||!r.heights.length)return;
    _rebuildFmtMenu(r.heights);
  });
}
function _rebuildFmtMenu(heights){
  var inner=document.getElementById('fmt-options');inner.innerHTML='';
  _addFmtOpt(inner,'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',t('fmt_best_mp4'),true);
  heights.forEach(function(h){var lbl=h+'p';if(h>=2160)lbl='4K ('+h+'p)';else if(h>=1440)lbl='2K ('+h+'p)';_addFmtOpt(inner,'bestvideo[height<='+h+']+bestaudio/best[height<='+h+']',lbl,false);});
  var sep=document.createElement('div');sep.className='cdd-sep';inner.appendChild(sep);
  _addFmtOpt(inner,'bestaudio[ext=m4a]/bestaudio',t('fmt_audio_m4a'),false);
  _addFmtOpt(inner,'bestaudio[ext=mp3]/bestaudio',t('fmt_audio_mp3'),false);
  _addFmtOpt(inner,'custom',t('fmt_custom'),false);
  document.querySelector('#cdd-dl-format .cdd-val').textContent=t('fmt_best_mp4');
}
function _addFmtOpt(c,val,label,selected){
  var d=document.createElement('div');d.className='cdd-opt'+(selected?' selected':'');d.setAttribute('data-val',val);d.textContent=label;
  d.addEventListener('click',function(){c.querySelectorAll('.cdd-opt').forEach(function(x){x.classList.remove('selected');});d.classList.add('selected');document.querySelector('#cdd-dl-format .cdd-val').textContent=label;document.getElementById('cdd-dl-format').classList.remove('open');document.getElementById('custom-fmt-wrap').style.display=val==='custom'?'block':'none';});
  c.appendChild(d);
}

/* ── Audio only ───────────────────────────────────────────────── */
function toggleAudioOnly(){
  STATE.audioOnly=!STATE.audioOnly;
  var tog=document.getElementById('audio-only-toggle');
  if(tog)tog.classList.toggle('on',STATE.audioOnly);
  var reToggle=document.getElementById('re-toggle');
  if(STATE.audioOnly&&reToggle.classList.contains('on')){
    reToggle.classList.remove('on');STATE.reEnabled=false;
    document.getElementById('re-panel').classList.remove('open');
    document.getElementById('right-panel').classList.remove('compact');
  }
  reToggle.style.opacity=STATE.audioOnly?'0.35':'1';
  reToggle.style.pointerEvents=STATE.audioOnly?'none':'auto';
  var reLabel=reToggle.nextElementSibling;if(reLabel)reLabel.style.opacity=STATE.audioOnly?'0.35':'1';
  pyCall('save_pref','audio_only_enabled',JSON.stringify(STATE.audioOnly));
}
function toggleAudioPanel(){
  STATE.audioSettingsOpen=!STATE.audioSettingsOpen;
  document.getElementById('audio-panel').style.display=STATE.audioSettingsOpen?'block':'none';
  var btn=document.getElementById('audio-expand-btn');
  if(btn)btn.style.opacity=STATE.audioSettingsOpen?'1':'0.45';
  pyCall('save_pref','audio_settings_open',JSON.stringify(STATE.audioSettingsOpen));
}
function selectAudioFmt(fmt){STATE.audioFmt=fmt;document.querySelectorAll('.audio-fmt-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-fmt')===fmt);});pyCall('save_pref','audio_fmt',fmt);}
function selectAudioBr(br){STATE.audioBr=br;document.querySelectorAll('.audio-br-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-br')===br);});pyCall('save_pref','audio_br',br);}

/* ── Re panel ─────────────────────────────────────────────────── */
function _mapHwCodec(softCodec,hw){
  if(!hw||hw==='none')return softCodec;
  var m={nvenc:{libx264:'h264_nvenc',libx265:'hevc_nvenc','libaom-av1':'av1_nvenc'},amf:{libx264:'h264_amf',libx265:'hevc_amf'},qsv:{libx264:'h264_qsv',libx265:'hevc_qsv','libaom-av1':'av1_qsv'},vt:{libx264:'h264_videotoolbox',libx265:'hevc_videotoolbox'}};
  var vendor=hw.split('_').pop();
  return (m[vendor]||{})[softCodec]||softCodec;
}
function startLocalReencode(){
  var zone=document.getElementById('re-drop-zone');
  var filePath=zone?zone.getAttribute('data-file'):'';
  if(!filePath){toast('Selecciona un archivo primero','err');return;}
  var s=collectSettings(true);s.reencode=true;
  pyCall('add_local_file',filePath,s).then(function(r){
    if(r.ok){toast(t('msg_file_added'),'ok');if(zone)zone.removeAttribute('data-file');}
    else toast(r.error||t('msg_file_error'),'err');
  });
}
function toggleGpuRendering(){
  var tog=document.getElementById('toggle-gpu');
  if(!tog)return;
  tog.classList.toggle('on');
  var val=tog.classList.contains('on');
  pyCall('save_pref','use_gpu_rendering',JSON.stringify(val));
  toast((val?'GPU activada':'GPU desactivada')+' — reinicia para aplicar','inf');
}

function toggleReEnabled(){
  var tog=document.getElementById('re-toggle');
  tog.classList.toggle('on');
  STATE.reEnabled=tog.classList.contains('on');
  pyCall('save_pref','re_enabled',JSON.stringify(STATE.reEnabled));
}
function toggleRePanel(){
  STATE.reOpen=!STATE.reOpen;
  document.getElementById('re-panel').classList.toggle('open',STATE.reOpen);
  document.getElementById('right-panel').classList.toggle('compact',STATE.reOpen);
  var btn=document.getElementById('re-expand-btn');
  if(btn)btn.style.opacity=STATE.reOpen?'1':'0.45';
  pyCall('save_pref','re_panel_open',JSON.stringify(STATE.reOpen));
}
function toggleRe(){toggleReEnabled();}

/* ── Collect settings ─────────────────────────────────────────── */
function collectSettings(reTab){
  var reOn=reTab?true:document.getElementById('re-toggle').classList.contains('on');
  var arsl=document.getElementById('auto-resolve').classList.contains('on');
  var fmt=cddVal('cdd-dl-format');
  var _trim=_getTrimValues();
  var s={dl_format:fmt,custom_format:document.getElementById('custom-format').value.trim(),auto_resolve:arsl,audio_only:STATE.audioOnly,audio_format:STATE.audioFmt,audio_bitrate:STATE.audioBr,reencode:reOn,custom_title:(document.getElementById('video-title')||{}).value||'',re_out_dir:STATE.reOutDir||STATE.outputDir,trim_start:_trim.start,trim_end:_trim.end,thumb:STATE._fetchThumb};
  if(reOn){
    var extId=reTab?'cdd-re-out-ext':'cdd-out-ext';
    var extVal=cddVal(extId);
    s.out_ext=extVal==='custom'?document.getElementById('out-ext-custom').value.trim():extVal;
    s.v_codec=cddVal(reTab?'cdd-re-v-codec':'cdd-v-codec');
    s.crf=parseInt((document.getElementById('crf-val')||{value:'23'}).value,10);
    s.resolution=cddVal(reTab?'cdd-re-resolution':'cdd-resolution');
    s.a_codec=cddVal(reTab?'cdd-re-a-codec':'cdd-a-codec');
    s.a_bitrate=cddVal(reTab?'cdd-re-a-bitrate':'cdd-a-bitrate');
    s.trim_start=(document.getElementById('trim-start')||{value:''}).value.trim();
    s.trim_end=(document.getElementById('trim-end')||{value:''}).value.trim();
    s.extra_args=(document.getElementById('extra-args')||{value:''}).value.trim();
  }
  return s;
}

/* ── Queue ─────────────────────────────────────────────────────── */
function _secToTime(s){
  s=Math.floor(s||0);var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  if(h>0)return h+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
  return m+':'+String(sec).padStart(2,'0');
}
function onTrimChange(){
  var s=parseInt(document.getElementById('trim-start-sl').value||0);
  var e=parseInt(document.getElementById('trim-end-sl').value||0);
  document.getElementById('trim-start-lbl').textContent=_secToTime(s);
  var dur=STATE._fetchDuration;
  document.getElementById('trim-end-lbl').textContent=(e>=Math.floor(dur)&&dur>0)?'Fin':_secToTime(e);
}
function _showTrimSliders(duration){
  if(!duration||duration<=0){document.getElementById('trim-section').style.display='none';return;}
  STATE._fetchDuration=duration;
  var sec=Math.floor(duration);
  var ts=document.getElementById('trim-start-sl'),te=document.getElementById('trim-end-sl');
  ts.max=sec;ts.value=0;te.max=sec;te.value=sec;
  onTrimChange();
  document.getElementById('trim-section').style.display='block';
}
function _getTrimValues(){
  if(!STATE._fetchDuration)return{start:'',end:''};
  var s=parseInt(document.getElementById('trim-start-sl').value||0);
  var e=parseInt(document.getElementById('trim-end-sl').value||0);
  var dur=Math.floor(STATE._fetchDuration);
  return{start:s>0?_secToTime(s):'',end:e<dur?_secToTime(e):''};
}

function addToQueue(){
  var url=document.getElementById('url-input').value.trim();
  if(!url){toast(t('msg_no_url'),'err');return;}
  pyCall('add_to_queue',url,collectSettings()).then(function(r){
    if(r.ok){document.getElementById('url-input').value='';var vt=document.getElementById('video-title');if(vt)vt.value='';document.getElementById('title-row').style.display='none';_lastFetchUrl='';toast(t('msg_added'),'ok');}
    else toast(r.error||t('msg_no_url'),'err');
  });
}
function handleUrlKey(e){if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();addToQueue();}}

function renderQueue(){
  var cnt=STATE.queue.length;
  document.getElementById('queue-count').textContent='('+cnt+')';
  var rqc=document.getElementById('re-queue-count');if(rqc)rqc.textContent='('+cnt+')';
  var empty='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;color:var(--tx3);padding:28px 0;"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span style="font-size:11px;">'+(lang==='en'?'Paste a URL or drop a file':lang==='hi'?'URL daalo ya file drop karo':'Pega una URL o arrastra un archivo')+'</span></div>';
  ['queue-list'].forEach(function(lid){var el=document.getElementById(lid);if(!el)return;if(!cnt)el.innerHTML=empty;else el.innerHTML=STATE.queue.map(function(item){return buildItemHtml(item,lid);}).join('');});
  var rel=document.getElementById('re-queue-list');if(rel)rel.innerHTML=STATE.queue.length?STATE.queue.map(function(item){return buildItemHtml(item,'re-queue-list');}).join(''):'';
}

/* Smart update: only patch progress inline, rebuild on status change */
function smartUpdateItem(item){
  ['queue-list','re-queue-list','c-queue-list'].forEach(function(lid){
    var el=document.getElementById('qi-'+lid+'-'+item.id);if(!el)return;
    var prevStatus=el.getAttribute('data-status');
    if(prevStatus===item.status&&(item.status==='downloading'||item.status==='reencoding')){
      var pct=Math.max(0,Math.min(100,Math.round(item.progress||0)));
      var fill=el.querySelector('.q-pfill');if(fill)fill.style.width=pct+'%';
      var inf=pct+'%';if(item.speed)inf+=' · '+item.speed;if(item.eta)inf+=' · '+item.eta;
      var pi=el.querySelector('.q-prog-info');if(pi)pi.textContent=inf;
    }else{
      var tmp=document.createElement('div');tmp.innerHTML=buildItemHtml(item,lid);el.replaceWith(tmp.firstChild);
    }
  });
}

function buildItemHtml(item,listId){
  listId=listId||'queue-list';
  var SL={pending:t('pending'),downloading:t('downloading'),reencoding:t('reencoding'),done:t('done'),error:t('error')};
  var SC={pending:'b-pending',downloading:'b-dl',reencoding:'b-re',done:'b-done',error:'b-error'};
  var ICX={error:'s-error',done:'s-done'};
  var pct=Math.max(0,Math.min(100,Math.round(item.progress||0)));
  var isPr=item.status==='downloading'||item.status==='reencoding';
  var barC=item.status==='reencoding'?'var(--purple)':'var(--blue)';
  var thumb=item.thumb?'<img class="q-thumb" src="'+esc(item.thumb)+'" loading="lazy">':'<div class="q-thumb-ph"><svg width="11" height="11" viewBox="0 0 24 24" fill="var(--tx3)"><path d="M8 5v14l11-7z"/></svg></div>';
  var prog='';
  if(isPr){var inf=pct+'%';if(item.speed)inf+=' · '+item.speed;if(item.eta)inf+=' · '+item.eta;prog='<div style="display:flex;align-items:center;gap:6px;margin-top:5px;"><div class="q-pbar"><div class="q-pfill" style="width:'+pct+'%;background:'+barC+';"></div></div><span class="q-prog-info" style="font-size:9px;color:var(--tx2);white-space:nowrap;">'+esc(inf)+'</span></div>';}
  else if(item.status==='done')prog='<div style="margin-top:5px;height:2px;background:var(--green);border-radius:1px;opacity:.4;"></div>';
  var err=(item.status==='error'&&item.error)?'<div style="font-size:9px;color:var(--red);margin-top:4px;line-height:1.4;word-break:break-all;">'+esc(item.error)+'</div>':'';
  var canRm=item.status!=='downloading'&&item.status!=='reencoding';
  var canRsv=item.status==='done'&&item.output_path;var canFld=!!item.output_path;var canRty=item.status==='error';
  var uid=listId+'-'+item.id;
  var rmBtn=canRm?'<button class="btn-d btn-sm q-rm-btn" onclick="removeItem(\''+item.id+'\')" style="padding:3px 6px !important;font-size:11px !important;line-height:1;">&times;</button>':'';
  var na='<div class="q-acts-normal" style="display:flex;gap:4px;margin-top:5px;">';
  if(canRsv)na+='<button class="btn-p btn-sm" onclick="sendToResolve(\''+item.id+'\')">'+t('btn_resolve')+'</button>';
  if(canFld)na+='<button class="btn-s btn-sm" onclick="openFolder(\''+item.id+'\')">'+t('btn_open')+'</button>';
  if(canRty)na+='<button class="btn-s btn-sm" onclick="retryItem(\''+item.id+'\')">'+t('btn_retry')+'</button>';
  if(canRm)na+=rmBtn;na+='</div>';
  var ca='<div class="q-acts-compact" style="display:none;flex-direction:column;gap:3px;align-items:center;">';
  if(canRsv)ca+='<button class="btn-p btn-sm" onclick="sendToResolve(\''+item.id+'\')">'+t('btn_resolve')+'</button>';
  if(canFld)ca+='<button class="btn-s btn-sm" onclick="openFolder(\''+item.id+'\')">'+t('btn_open')+'</button>';
  if(canRty)ca+='<button class="btn-s btn-sm" onclick="retryItem(\''+item.id+'\')">'+t('btn_retry')+'</button>';
  ca+='</div>';
  // Side action buttons (always on right, column layout)
  var sideActs='';
  if(canRsv||canFld||canRty){
    sideActs='<div class="q-acts-side">';
    if(canRsv)sideActs+='<button class="btn-p btn-sm" onclick="sendToResolve(\'' +item.id+ '\')">' +t('btn_resolve')+ '</button>';
    if(canFld)sideActs+='<button class="btn-s btn-sm" onclick="openFolder(\'' +item.id+ '\')">' +t('btn_open')+ '</button>';
    if(canRty)sideActs+='<button class="btn-s btn-sm" onclick="retryItem(\'' +item.id+ '\')">' +t('btn_retry')+ '</button>';
    sideActs+='</div>';
  }
  return '<div class="q-item '+(ICX[item.status]||'')+'" id="qi-'+uid+'" data-status="'+item.status+'">'
    // X always absolute top-right
    +rmBtn
    +'<div style="display:flex;gap:9px;align-items:center;">'
    +thumb
    +'<div style="flex:1;min-width:0;">'
    +'<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;flex-wrap:wrap;">'
    +'<span class="badge '+(SC[item.status]||'b-pending')+'">'+(SL[item.status]||item.status)+'</span>'
    +'<span style="font-weight:700;font-size:11px;color:var(--tx);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px;" title="'+esc(item.title||item.url)+'">'+esc(item.title||item.url)+'</span>'
    +'</div>'
    +'<div style="font-size:9px;color:var(--tx3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+esc(item.url)+'</div>'
    +prog+err
    +'</div>'
    +sideActs
    +'</div></div>';
}
function updateSbInfo(){
  var done=STATE.queue.filter(function(x){return x.status==='done';}).length,total=STATE.queue.length;
  var txt=total?done+'/'+total+(lang==='en'?' done':lang==='hi'?' ho gaye':' listos'):'';
  document.getElementById('sb-info').textContent=txt;
  var ci=document.getElementById('c-info');if(ci)ci.textContent=txt;
  var cl=document.getElementById('c-queue-list');
  if(cl&&document.getElementById('compact-wrap').classList.contains('show'))
    cl.innerHTML=STATE.queue.map(function(item){return buildItemHtml(item,'c-queue-list');}).join('');
}

/* Queue actions */
function removeItem(id){pyCall('remove_item',id);}
function retryItem(id){pyCall('retry_item',id);}
function clearDone(){pyCall('clear_done');}
function sendToResolve(id){pyCall('send_to_resolve',id).then(function(r){toast(r.ok?t('msg_sent_resolve'):(r.error||t('msg_error_resolve')),r.ok?'ok':'err');});}
function openFolder(id){for(var i=0;i<STATE.queue.length;i++){if(STATE.queue[i].id===id&&STATE.queue[i].output_path){pyCall('open_in_explorer',STATE.queue[i].output_path);return;}}}
function sendAllToResolve(){pyCall('send_all_to_resolve').then(function(r){if(!r.ok)return;toast(r.total===0?t('msg_none_ready'):'Enviados '+r.sent+'/'+r.total+' '+t('msg_all_sent'),r.sent>0?'ok':'err');});}

/* Quick folder */
function browseQuickFolder(){
  pyCall('browse_output_dir').then(function(r){
    if(r.ok){
      var inp=document.getElementById('quick-folder-input');if(inp)inp.value=r.path;
      STATE._qfManual=r.path;
      STATE.outputDir=r.path;
      renderPathHistory();
    }
  });
}
function applyQuickFolder(){
  var path=STATE._qfManual||'';if(!path)return;
  STATE.outputDir=path;
  document.getElementById('cfg-out-dir').textContent=path;
  var roid=document.getElementById('re-out-dir-input');if(roid)roid.value=path;
  pyCall('save_pref','output_dir',path);
  pyCall('add_path_history',path).then(function(){
    STATE.pathHistory.unshift(path);STATE.pathHistory=STATE.pathHistory.filter(function(p,i,a){return a.indexOf(p)===i;}).slice(0,10);
    renderPathHistory();
  });
  toast((lang==='en'?'Output folder: ':'Carpeta de salida: ')+path.split(/[\/]/).pop(),'ok');
  STATE.quickFolderOpen=false;
  var btn=document.getElementById('quick-folder-btn');if(btn)btn.classList.remove('active');
  document.getElementById('quick-folder-panel').style.display='none';
}

/* Thumbnail download */
function downloadThumbnail(){
  var url=document.getElementById('url-input').value.trim();
  if(!url){toast(t('msg_no_url'),'err');return;}
  var btn=document.getElementById('thumb-dl-btn');btn.disabled=true;
  toast(lang==='en'?'Downloading thumbnail...':'Descargando miniatura...','inf');
  pyCall('download_thumbnail',url,STATE.outputDir||'').then(function(r){
    btn.disabled=false;
    if(r.ok)toast(lang==='en'?'Thumbnail saved':'Miniatura guardada','ok');
    else toast(r.error||'Error','err');
  });
}

/* File browsing */
function browseFileToReencode(){
  pyCall('browse_file_to_reencode').then(function(r){
    if(!r.ok){
      // Fallback: hidden file input
      var inp=document.getElementById('_hidden_file_input');
      if(!inp){inp=document.createElement('input');inp.type='file';inp.id='_hidden_file_input';inp.multiple=true;inp.style.display='none';document.body.appendChild(inp);}
      inp.onchange=function(){
        var files=Array.from(inp.files||[]);
        files.forEach(function(f){
          var p=f.path;
          if(p){var s=collectSettings(STATE.activeView==='re');s.reencode=true;pyCall('add_local_file',p,s).then(function(res){toast(res.ok?t('msg_file_added'):(res.error||t('msg_file_error')),res.ok?'ok':'err');});}
        });
        inp.value='';
      };
      inp.click();
      return;
    }
    var settings=collectSettings(STATE.activeView==='re');settings.reencode=true;
    r.paths.forEach(function(p){pyCall('add_local_file',p,settings).then(function(res){toast(res.ok?t('msg_file_added'):(res.error||t('msg_file_error')),res.ok?'ok':'err');});});
  });
}
function browseReOutputDir(){
  pyCall('browse_re_output_dir').then(function(r){
    if(r.ok){STATE.reOutDir=r.path;['re-out-dir-input','re-main-out-dir'].forEach(function(id){var el=document.getElementById(id);if(el)el.value=r.path;});toast(t('msg_folder_updated'),'ok');}
  });
}

/* Drop zones — pywebview/CEF compatible */
function _getFilePaths(dataTransfer){
  var paths=[];
  var files=dataTransfer.files||[];
  for(var i=0;i<files.length;i++){
    // CEF/pywebview exposes .path on File objects
    var p=files[i].path||files[i].webkitRelativePath||null;
    if(p)paths.push(p);
  }
  // Fallback: check items
  if(!paths.length&&dataTransfer.items){
    for(var j=0;j<dataTransfer.items.length;j++){
      var item=dataTransfer.items[j];
      if(item.kind==='file'){var f=item.getAsFile();if(f&&f.path)paths.push(f.path);}
    }
  }
  return paths;
}
document.addEventListener('dragover',function(e){e.preventDefault();},false);
document.addEventListener('drop',function(e){e.preventDefault();},false);
function initDropZone(zoneId,reTab){
  var zone=document.getElementById(zoneId);if(!zone)return;
  zone.addEventListener('dragenter',function(e){e.preventDefault();e.stopPropagation();zone.classList.add('drag-over');});
  zone.addEventListener('dragleave',function(e){if(!zone.contains(e.relatedTarget))zone.classList.remove('drag-over');});
  zone.addEventListener('dragover',function(e){e.preventDefault();e.stopPropagation();return false;});
  zone.addEventListener('drop',function(e){
    e.preventDefault();e.stopPropagation();zone.classList.remove('drag-over');
    var paths=_getFilePaths(e.dataTransfer);
    if(!paths.length){toast(t('msg_file_error')+': no path','err');return;}
    var settings=collectSettings(reTab);settings.reencode=true;
    paths.forEach(function(p){pyCall('add_local_file',p,settings).then(function(r){toast(r.ok?t('msg_file_added'):(r.error||t('msg_file_error')),r.ok?'ok':'err');});});
  });
  zone.addEventListener('click',function(e){if(e.target.tagName!=='BUTTON'&&!e.target.closest('button'))browseFileToReencode();});
}
function initQueueDrop(){
  var rp=document.getElementById('right-panel'),ov=document.getElementById('drop-overlay');if(!rp)return;
  rp.addEventListener('dragenter',function(e){if(e.target.closest('#re-drop-zone'))return;e.preventDefault();ov.classList.add('active');});
  rp.addEventListener('dragleave',function(e){if(e.target.closest('#re-drop-zone'))return;if(!rp.contains(e.relatedTarget))ov.classList.remove('active');});
  rp.addEventListener('dragover',function(e){if(!e.target.closest('#re-drop-zone')){e.preventDefault();return false;}});
  rp.addEventListener('drop',function(e){
    if(e.target.closest('#re-drop-zone'))return;
    e.preventDefault();ov.classList.remove('active');
    var paths=_getFilePaths(e.dataTransfer);if(!paths.length)return;
    var settings=collectSettings();if(STATE.reOpen)settings.reencode=true;
    paths.forEach(function(p){pyCall('add_local_file',p,settings).then(function(r){toast(r.ok?t('msg_file_added'):(r.error||t('msg_file_error')),r.ok?'ok':'err');});});
  });
}

/* Resolve */
function _applyResolveState(r){
  var dot=document.getElementById('resolve-dot'),lbl=document.getElementById('resolve-label'),pil=document.getElementById('resolve-pill');
  var cdot=document.getElementById('c-resolve-dot'),clbl=document.getElementById('c-resolve-lbl');
  STATE.resolveOk=r.ok;
  if(r.ok){
    dot.style.background='var(--green)';lbl.style.color='var(--green)';pil.style.borderColor='rgba(92,224,122,.4)';lbl.textContent=t('status_connected')+(r.project?' — '+r.project:'');
    if(cdot)cdot.style.background='var(--green)';if(clbl){clbl.style.color='var(--green)';clbl.textContent=t('status_connected');}
  }else{
    dot.style.background='var(--red)';lbl.style.color='var(--tx2)';pil.style.borderColor='var(--bd)';lbl.textContent=t('status_connect_davinci');
    if(cdot)cdot.style.background='var(--red)';if(clbl){clbl.style.color='var(--tx2)';clbl.textContent=t('status_connect_davinci');}
  }
}
function checkResolve(){pyCall('check_resolve').then(_applyResolveState);}
function browseCookies(){
  pyCall('browse_cookies_file').then(function(r){
    if(r.ok){
      STATE.cookiesFile=r.path;
      var lbl=document.getElementById('cookies-label');
      if(lbl)lbl.textContent=t('lbl_cookies_set');
      var pill=document.getElementById('cookies-pill');
      if(pill)pill.style.borderColor='rgba(92,224,122,.5)';
      toast(t('lbl_cookies_set'),'ok');
    }
  });
}
function browseOutputDir(){pyCall('browse_output_dir').then(function(r){if(r.ok){STATE.outputDir=r.path;document.getElementById('cfg-out-dir').textContent=r.path;toast(t('msg_folder_updated'),'ok');}});}

/* Nav */
function switchView(v){
  if(STATE.activeView===v)return;
  STATE.activeView=v;
  ['dl','re','cfg'].forEach(function(n){
    var el=document.getElementById('view-'+n);
    var ma=document.getElementById('main-area');
    if(n===v){
      if(n==='dl'){if(ma)ma.style.display='flex';}
      el.style.display='flex';
      el.style.opacity='0';el.style.transform='translateY(6px)';
      requestAnimationFrame(function(){
        el.style.transition='opacity .18s ease,transform .18s ease';
        el.style.opacity='1';el.style.transform='translateY(0)';
        setTimeout(function(){el.style.transition='';},200);
      });
    }else{
      el.style.display='none';
      if(n==='dl'&&ma)ma.style.display='none';
    }
    document.getElementById('nav-'+n).classList.toggle('active',n===v);
  });
}

/* Compact */
var _preCompactW=0,_preCompactH=0;
function enterCompact(){
  _preCompactW=window.outerWidth||window.innerWidth||1140;
  _preCompactH=window.outerHeight||window.innerHeight||720;
  pyCall('save_pref','pre_compact_w',String(_preCompactW));
  pyCall('save_pref','pre_compact_h',String(_preCompactH));
  pyCall('save_pref','compact_active',JSON.stringify(true));
  document.getElementById('compact-wrap').classList.add('show');
  pyCall('resize_window',320,520);
  updateSbInfo();
}
function exitCompact(){
  document.getElementById('compact-wrap').classList.remove('show');
  pyCall('save_pref','compact_active',JSON.stringify(false));
  pyCall('resize_window',
    _preCompactW>100?_preCompactW:1140,
    _preCompactH>100?_preCompactH:720);
}
function addCompact(){
  var url=document.getElementById('c-url').value.trim();if(!url){toast(t('msg_no_url'),'err');return;}
  var fmt=cddVal('cdd-c-format')||'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
  pyCall('add_to_queue',url,{dl_format:fmt,reencode:false,auto_resolve:false,audio_only:false}).then(function(r){
    if(r.ok){document.getElementById('c-url').value='';toast(t('msg_added'),'ok');}
    else toast(r.error||t('msg_no_url'),'err');
  });
}

/* Log / deps */
function appendLog(id,text,cls){var el=document.getElementById(id);if(!el)return;var sp=document.createElement('span');if(cls)sp.className=cls;sp.textContent=text+'\n';el.appendChild(sp);el.scrollTop=el.scrollHeight;}
function clearLog(id){var el=document.getElementById(id);if(el)el.innerHTML='';}
function updateYtDlp(){clearLog('ytdlp-log');var spin=document.getElementById('ytdlp-spin'),btn=document.getElementById('ytdlp-update-btn');spin.style.display='inline-block';btn.disabled=true;appendLog('ytdlp-log',lang==='en'?'Installing yt-dlp via pip...':'Instalando yt-dlp via pip...','l-inf');pyCall('update_ytdlp').then(function(r){// spinner stays until dep_status event confirms completion
if(!r.ok){spin.style.display='none';btn.disabled=false;appendLog('ytdlp-log',r.error||'Error.','l-err');toast(t('msg_ytdlp_error'),'err');}else{appendLog('ytdlp-log',r.output||'En progreso...','l-inf');// hide spinner when dep_status arrives
window._ytdlpInstalling=function(){spin.style.display='none';btn.disabled=false;toast(t('msg_ytdlp_updated'),'ok');};}});}
function checkFfmpegVersion(){clearLog('ffmpeg-log');var spin=document.getElementById('ffmpeg-spin');spin.style.display='inline-block';pyCall('check_ffmpeg_version').then(function(r){spin.style.display='none';if(r.ffmpeg)appendLog('ffmpeg-log',r.ffmpeg,r.ffmpeg_ok?'l-ok':'l-err');if(r.ffprobe)appendLog('ffmpeg-log',r.ffprobe,r.ffprobe_ok?'l-ok':'l-err');if(!r.ffmpeg&&!r.ffprobe)appendLog('ffmpeg-log',r.error||'Error.','l-err');});}
function installFfmpegWinget(){clearLog('ffmpeg-log');var spin=document.getElementById('ffmpeg-spin');if(spin)spin.style.display='inline-block';appendLog('ffmpeg-log',lang==='en'?'Starting ffmpeg download...':'Iniciando descarga de ffmpeg...','l-inf');pyCall('install_ffmpeg_winget').then(function(r){if(!r.ok&&r.manual){appendLog('ffmpeg-log',r.instructions||r.error||'Error.','l-inf');}else if(!r.ok){if(spin)spin.style.display='none';appendLog('ffmpeg-log',r.error||'Error.','l-err');}// on success: log events will arrive via _onEvent('log')
});}
function openFfmpegWeb(){pyCall('open_ffmpeg_web');}
function checkDeps(){pyCall('check_deps').then(function(d){document.getElementById('dep-ytdlp').style.display=d.yt_dlp?'none':'flex';document.getElementById('dep-ffmpeg').style.display=(d.ffmpeg&&d.ffprobe)?'none':'flex';});}

/* ── INIT ───────────────────────────────────────────────────── */
/* Container coherence */
var _AUDIO_ONLY_CONTAINERS=new Set(['mp3','m4a','flac','wav','ogg','opus','aac']);
var _IMAGE_CONTAINERS=new Set(['png','jpg','jpeg','webp','avif','gif','bmp']);
function applyContainerCoherence(cddId,val){
  if(STATE._advancedRe)return; // advanced mode: no restrictions
  var isAudio=_AUDIO_ONLY_CONTAINERS.has(val);
  var isImage=_IMAGE_CONTAINERS.has(val);
  // Disable video codec + resolution if audio-only or image container
  var vCodecId=cddId==='cdd-re-out-ext'?'cdd-re-v-codec':'cdd-v-codec';
  var resId=cddId==='cdd-re-out-ext'?'cdd-re-resolution':'cdd-resolution';
  var aCodecId=cddId==='cdd-re-out-ext'?'cdd-re-a-codec':'cdd-a-codec';
  var crfRow=document.getElementById('crf-row');
  _setGroupDisabled(vCodecId, isAudio);
  _setGroupDisabled(resId, isAudio);
  if(crfRow)crfRow.style.opacity=isAudio?'0.35':'1';
  // Image: disable audio codec
  _setGroupDisabled(aCodecId, isImage);
}
function _setGroupDisabled(cddId,disabled){
  var el=document.getElementById(cddId);if(!el)return;
  el.style.opacity=disabled?'0.35':'1';
  el.style.pointerEvents=disabled?'none':'auto';
  var trigger=el.querySelector('.cdd-trigger');
  if(trigger)trigger.title=disabled?'No disponible para este formato':'';
}
STATE._advancedRe=false;
function toggleAdvancedRe(val){
  STATE._advancedRe=val;
  if(!val){
    // Re-apply current container selection
    var v=cddVal('cdd-out-ext');if(v)applyContainerCoherence('cdd-out-ext',v);
    var v2=cddVal('cdd-re-out-ext');if(v2)applyContainerCoherence('cdd-re-out-ext',v2);
  }else{
    // Unlock everything
    ['cdd-v-codec','cdd-resolution','cdd-a-codec','cdd-re-v-codec','cdd-re-resolution','cdd-re-a-codec'].forEach(function(id){_setGroupDisabled(id,false);});
    var cr=document.getElementById('crf-row');if(cr)cr.style.opacity='1';
  }
  pyCall('save_pref','advanced_reencode',val?'true':'false');
}

/* First-run dialog */
function showFirstRunDialog(){
  if(!document.getElementById('first-run-overlay')){
    var ov=document.createElement('div');
    ov.id='first-run-overlay';
    ov.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(10,10,10,.92);display:flex;align-items:center;justify-content:center;';
    ov.innerHTML='<div style="background:var(--sf);border:2px solid var(--ac);border-radius:var(--r);padding:24px;max-width:360px;width:90%;text-align:center;">'
      +'<div style="font-family:var(--font-title);font-size:20px;font-weight:900;color:var(--ac);margin-bottom:10px;">MdLd</div>'
      +'<div style="font-size:12px;color:var(--tx2);line-height:1.6;margin-bottom:18px;" id="frd-txt"></div>'
      +'<div style="display:flex;gap:10px;justify-content:center;">'
      +'<button class="btn-p" onclick="closeFirstRun(true)" id="frd-yes"></button>'
      +'<button class="btn-s" onclick="closeFirstRun(false)" id="frd-no"></button>'
      +'</div></div>';
    document.body.appendChild(ov);
  }
  document.getElementById('frd-txt').textContent=lang==='en'?'Do you want to enable automatic update checks for yt-dlp and FFmpeg on startup?':lang==='hi'?'Kya aap startup pe automatic updates check karna chahte hain?':'¿Deseas activar la verificación automática de actualizaciones de yt-dlp y FFmpeg al iniciar?';
  document.getElementById('frd-yes').textContent=lang==='en'?'Yes, enable':'Sí, activar';
  document.getElementById('frd-no').textContent=lang==='en'?'No thanks':'No, gracias';
  document.getElementById('first-run-overlay').style.display='flex';
}
function closeFirstRun(enable){
  var ov=document.getElementById('first-run-overlay');if(ov)ov.style.display='none';
  pyCall('save_pref','auto_updates',enable?'true':'false');
  pyCall('save_pref','first_run','false');
  STATE.autoUpdates=enable;
}

/* Path history */
STATE.pathHistory=[];
STATE.quickFolderOpen=false;
function toggleQuickFolder(){
  STATE.quickFolderOpen=!STATE.quickFolderOpen;
  var btn=document.getElementById('quick-folder-btn');
  btn.classList.toggle('active',STATE.quickFolderOpen);
  document.getElementById('quick-folder-panel').style.display=STATE.quickFolderOpen?'block':'none';
}
function renderPathHistory(){
  var hist=STATE.pathHistory;
  var list=document.getElementById('path-hist-list');if(!list)return;
  if(!hist.length){list.innerHTML='<div style="font-size:10px;color:var(--tx3);padding:4px 0;">'+(lang==='en'?'No recent folders':'Sin carpetas recientes')+'</div>';return;}
  list.innerHTML='';
  hist.forEach(function(p){
    var row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--bd);';
    var sp=document.createElement('span');
    sp.style.cssText='flex:1;font-size:10px;color:var(--tx2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;';
    sp.textContent=p;
    sp.addEventListener('click',function(){setOutputDirFromHistory(p);});
    row.appendChild(sp);
    list.appendChild(row);
  });
}
function setOutputDirFromHistory(path){
  STATE.outputDir=path;
  document.getElementById('cfg-out-dir').textContent=path;
  var roid=document.getElementById('re-out-dir-input');if(roid)roid.value=path;
  pyCall('save_pref','output_dir',path);
  toast((lang==='en'?'Folder: ':'Carpeta: ')+path.split(/[\/]/).pop(),'ok');
  STATE.quickFolderOpen=false;
  document.getElementById('quick-folder-btn').classList.remove('active');
  document.getElementById('quick-folder-panel').style.display='none';
}

var _initDone=false;
document.addEventListener('DOMContentLoaded',function(){
  if(typeof QWebChannel==='undefined'){
    console.warn('[MDowlet] QWebChannel not available');
    return;
  }
  new QWebChannel(qt.webChannelTransport,function(channel){
    _api=channel.objects.api;
    // Forward Python → JS events via the onEvent signal
    _api.onEvent.connect(function(payload){
      try{window._onEvent(JSON.parse(payload));}catch(e){console.error('[MDowlet] onEvent error',e);}
    });
    if(_initDone)return;_initDone=true;
  initDropdowns();
  initDropZone('re-drop-zone',false);
  initDropZone('re-main-drop',true);
  initQueueDrop();

  var s_firstRun=false;
  pyCall('get_settings_json').then(function(s){
    s_firstRun=s.first_run===true||s.first_run==='true';
    var nl=(navigator.language||'').toLowerCase();var sl=s.lang&&s.lang!=='auto'?s.lang:(nl.startsWith('hi')?'hi':nl.startsWith('es')?'es':'en');
    lang=sl;applyI18n();cddSet('cdd-lang',lang,lang==='en'?'English':lang==='hi'?'Hinglish':'Español');
    if(s.theme)applyTheme(s.theme,true);
    if(s.custom_theme&&Object.keys(s.custom_theme).length)Object.keys(s.custom_theme).forEach(function(k){document.documentElement.style.setProperty(k,s.custom_theme[k]);});
    var gridOn=s.dot_visible!==false&&s.dot_visible!=='false';
    var dotTog=document.getElementById('dot-toggle');
    if(!gridOn){dotTog.classList.remove('on');document.getElementById('dot-grid-el').style.display='none';}
    if(s.dot_color){document.getElementById('hx-dot').value=s.dot_color;document.getElementById('hs-dot').style.background=s.dot_color;}
    if(s.dot_opacity!==undefined){document.getElementById('dot-opacity').value=s.dot_opacity;document.getElementById('dot-opacity-val').textContent=s.dot_opacity+'%';}
    _rebuildDotGrid();
    if(s.glass_blur!==undefined){document.getElementById('glass-blur').value=s.glass_blur;document.getElementById('glass-blur-val').textContent=s.glass_blur+'px';}
    if(s.glass_opacity!==undefined){document.getElementById('glass-opacity').value=s.glass_opacity;document.getElementById('glass-opacity-val').textContent=s.glass_opacity+'%';}
    _computeGlassSf();
    if(s.border_radius!==undefined){document.getElementById('radius-slider').value=s.border_radius;document.getElementById('radius-val').textContent=s.border_radius+'px';document.documentElement.style.setProperty('--r',s.border_radius+'px');}
    if(s.output_dir){STATE.outputDir=s.output_dir;document.getElementById('cfg-out-dir').textContent=s.output_dir;}
    STATE.reOutDir=s.re_out_dir||s.output_dir||'';
    ['re-out-dir-input','re-main-out-dir'].forEach(function(id){var el=document.getElementById(id);if(el)el.value=STATE.reOutDir;});
    if(s.bg_opacity!==undefined){document.getElementById('bg-opacity').value=s.bg_opacity;document.getElementById('bg-opacity-val').textContent=s.bg_opacity+'%';_bgState.bg_opacity=parseInt(s.bg_opacity);}
    if(s.bg_blur!==undefined){document.getElementById('bg-blur').value=s.bg_blur;document.getElementById('bg-blur-val').textContent=s.bg_blur+'px';_bgState.bg_blur=parseInt(s.bg_blur);}
    if(s.bg_zoom!==undefined){document.getElementById('bg-zoom').value=s.bg_zoom;document.getElementById('bg-zoom-val').textContent=s.bg_zoom+'%';_bgState.bg_zoom=parseInt(s.bg_zoom);}
    if(s.bg_img){document.getElementById('bg-img-url').value=s.bg_img;_bgState.bg_img=s.bg_img;_setBgImg(s.bg_img);}
    if(s.version){document.getElementById('about-version').textContent=s.version;var vb=document.getElementById('ver-badge');vb.textContent='V'+s.version;vb.style.borderColor='var(--ac)';vb.style.color='var(--ac)';}
    syncHexInputs();
    // Load user-saved named themes (s already has all prefs via get_settings_json)
    loadNamedThemesFromPrefs(s);
    // Also set window._customColors from saved custom_theme
    if(s.custom_theme&&typeof s.custom_theme==='object'&&Object.keys(s.custom_theme).length){
      window._customColors=s.custom_theme;
      Object.keys(s.custom_theme).forEach(function(k){
        document.documentElement.style.setProperty(k,s.custom_theme[k]);
      });
    }
    // Advanced reencode mode
    if(s.advanced_reencode===true||s.advanced_reencode==='true'){STATE._advancedRe=true;var atog=document.getElementById('advanced-re-toggle');if(atog)atog.classList.add('on');}
    // Path history
    STATE.pathHistory=Array.isArray(s.path_history)?s.path_history:[];
    STATE.cookiesFile=s.cookies_file||'';
    if(STATE.cookiesFile){var cl=document.getElementById('cookies-label');if(cl)cl.textContent=t('lbl_cookies_set');var cp=document.getElementById('cookies-pill');if(cp)cp.style.borderColor='rgba(92,224,122,.5)';}
    renderPathHistory();
    // Version badge accent
    var vb=document.getElementById('ver-badge');if(vb){vb.style.borderColor='var(--ac)';vb.style.color='var(--ac)';}
    // Auto updates
    STATE.autoUpdates=s.auto_updates;
    // GPU rendering toggle state
    if(s.use_gpu_rendering!==false){
      var gt=document.getElementById('toggle-gpu');if(gt)gt.classList.add('on');
    }
    // Load available hw encoders for the GPU acceleration dropdown
    pyCall('check_hw_encoders').then(function(r){
      if(!r||!r.ok)return;
      var menu=document.getElementById('hw-accel-opts');if(!menu)return;
      Object.entries(r.encoders).forEach(function(pair){
        if(!pair[1].available)return;
        var d=document.createElement('div');
        d.className='cdd-opt';d.setAttribute('data-val',pair[0]);
        d.textContent=pair[1].label;menu.appendChild(d);
      });
    });
    return pyCall('get_queue_json');
  }).then(function(q){
    STATE.queue=Array.isArray(q)?q:[];renderQueue();updateSbInfo();
    checkResolve();checkDeps();
    setInterval(checkResolve,30000);
    // Save window size on resize
    var _resizeTimer=null;
    window.addEventListener('resize',function(){
      clearTimeout(_resizeTimer);
      _resizeTimer=setTimeout(function(){
        pyCall('save_window_size',window.outerWidth||window.innerWidth,window.outerHeight||window.innerHeight);
      },500);
    });
    // First run dialog
    if(s_firstRun)setTimeout(showFirstRunDialog,800);
  });
  });
});
