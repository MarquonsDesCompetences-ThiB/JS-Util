export enum ELanguage_Code {
  fr,
  fr_be,
  fr_ca,
  fr_fr,
  fr_lu,
  fr_mc,
  fr_ch,

  en,
  en_au,
  en_bz,
  en_ca,
  en_ie,
  en_jm,
  en_nz,
  en_ph,
  en_za,
  en_tt,
  en_gb,
  en_us,
  en_zw,
  de,
  de_at,
  de_de,
  de_li,
  de_lu,
  de_ch,
  it,
  it_ch,
  es,
  es_ar,
  es_bo,
  es_cl,
  es_co,
  es_cr,
  es_do,
  es_ec,
  es_sv,
  es_gt,
  es_hn,
  es_mx,
  es_ni,
  es_pa,
  es_py,
  es_pe,
  es_pr,
  es_es,
  es_uy,
  es_ve,

  af,
  sq,
  an,
  ar,
  ar_dz,
  ar_bh,
  ar_eg,
  ar_iq,
  ar_jo,
  ar_kw,
  ar_lb,
  ar_ly,
  ar_ma,
  ar_om,
  ar_qa,
  ar_sa,
  ar_sy,
  ar_tn,
  ar_ae,
  ar_ye,
  hy,
  as,
  ast,
  az,
  eu,
  bg,
  be,
  bn,
  bs,
  br,
  my,
  ca,
  ch,
  ce,
  zh,
  zh_hk,
  zh_cn,
  zh_sg,
  zh_tw,
  cv,
  co,
  cr,
  hr,
  cs,
  da,
  nl,
  nl_be,

  eo,
  et,
  fo,
  fa,
  fj,
  fi,
  fy,
  fur,
  gd,
  gd_ie,
  gl,
  ka,
  el,
  gu,
  ht,
  he,
  hi,
  hu,
  is,
  id,
  iu,
  ga,

  ja,
  kn,
  ks,
  kk,
  km,
  ky,
  tlh,
  ko,
  ko_kp,
  ko_kr,
  la,
  lv,
  lt,
  lb,
  mk,
  ms,
  ml,
  mt,
  mi,
  mr,
  mo,
  nv,
  ng,
  ne,
  no,
  nb,
  nn,
  oc,
  or,
  om,
  irn,
  fa_ir,
  pl,
  pt,
  pt_br,
  pa,
  pa_in,
  pa_pk,
  qu,
  rm,
  ro,
  ro_mo,
  ru,
  ru_mo,
  sz,
  sg,
  sa,
  sc,
  sd,
  si,
  sr,
  sk,
  sl,
  so,
  sb,

  sx,
  sw,
  sv,
  sv_fi,
  sv_sv,
  ta,
  tt,
  te,
  th,
  tig,
  ts,
  tn,
  tr,
  tk,
  uk,
  hsb,
  ur,
  ve,
  vi,
  vo,
  wa,
  cy,
  xh,
  ji,
  zu,
}

/**
 * From https]://gist.github.com/wpsmith/7604842
 */
export const languages = {
  [ELanguage_Code.fr]: "Français (Standard)",
  [ELanguage_Code.fr_be]: "Français (Belgique)",
  [ELanguage_Code.fr_ca]: "Français (Canada)",
  [ELanguage_Code.fr_fr]: "Français (France)",
  [ELanguage_Code.fr_lu]: "Français (Luxembourg)",
  [ELanguage_Code.fr_mc]: "Français (Monaco)",
  [ELanguage_Code.fr_ch]: "Français (Suisse)",

  [ELanguage_Code.en]: "English",
  [ELanguage_Code.en_au]: "English (Australia)",
  [ELanguage_Code.en_bz]: "English (Belize)",
  [ELanguage_Code.en_ca]: "English (Canada)",
  [ELanguage_Code.en_ie]: "English (Ireland)",
  [ELanguage_Code.en_jm]: "English (Jamaica)",
  [ELanguage_Code.en_nz]: "English (New Zealand)",
  [ELanguage_Code.en_ph]: "English (Philippines)",
  [ELanguage_Code.en_za]: "English (South Africa)",
  [ELanguage_Code.en_tt]: "English (Trinidad & Tobago)",
  [ELanguage_Code.en_gb]: "English (United Kingdom)",
  [ELanguage_Code.en_us]: "English (United States)",
  [ELanguage_Code.en_zw]: "English (Zimbabwe)",
  [ELanguage_Code.de]: "German (Standard)",
  [ELanguage_Code.de_at]: "German (Austria)",
  [ELanguage_Code.de_de]: "German (Germany)",
  [ELanguage_Code.de_li]: "German (Liechtenstein)",
  [ELanguage_Code.de_lu]: "German (Luxembourg)",
  [ELanguage_Code.de_ch]: "German (Switzerland)",
  [ELanguage_Code.it]: "Italian (Standard)",
  [ELanguage_Code.it_ch]: "Italian (Switzerland)",
  [ELanguage_Code.es]: "Spanish",
  [ELanguage_Code.es_ar]: "Spanish (Argentina)",
  [ELanguage_Code.es_bo]: "Spanish (Bolivia)",
  [ELanguage_Code.es_cl]: "Spanish (Chile)",
  [ELanguage_Code.es_co]: "Spanish (Colombia)",
  [ELanguage_Code.es_cr]: "Spanish (Costa Rica)",
  [ELanguage_Code.es_do]: "Spanish (Dominican Republic)",
  [ELanguage_Code.es_ec]: "Spanish (Ecuador)",
  [ELanguage_Code.es_sv]: "Spanish (El Salvador)",
  [ELanguage_Code.es_gt]: "Spanish (Guatemala)",
  [ELanguage_Code.es_hn]: "Spanish (Honduras)",
  [ELanguage_Code.es_mx]: "Spanish (Mexico)",
  [ELanguage_Code.es_ni]: "Spanish (Nicaragua)",
  [ELanguage_Code.es_pa]: "Spanish (Panama)",
  [ELanguage_Code.es_py]: "Spanish (Paraguay)",
  [ELanguage_Code.es_pe]: "Spanish (Peru)",
  [ELanguage_Code.es_pr]: "Spanish (Puerto Rico)",
  [ELanguage_Code.es_es]: "Spanish (Spain)",
  [ELanguage_Code.es_uy]: "Spanish (Uruguay)",
  [ELanguage_Code.es_ve]: "Spanish (Venezuela)",

  [ELanguage_Code.af]: "Afrikaans",
  [ELanguage_Code.sq]: "Albanian",
  [ELanguage_Code.an]: "Aragonese",
  [ELanguage_Code.ar]: "Arabic (Standard)",
  [ELanguage_Code.ar_dz]: "Arabic (Algeria)",
  [ELanguage_Code.ar_bh]: "Arabic (Bahrain)",
  [ELanguage_Code.ar_eg]: "Arabic (Egypt)",
  [ELanguage_Code.ar_iq]: "Arabic (Iraq)",
  [ELanguage_Code.ar_jo]: "Arabic (Jordan)",
  [ELanguage_Code.ar_kw]: "Arabic (Kuwait)",
  [ELanguage_Code.ar_lb]: "Arabic (Lebanon)",
  [ELanguage_Code.ar_ly]: "Arabic (Libya)",
  [ELanguage_Code.ar_ma]: "Arabic (Morocco)",
  [ELanguage_Code.ar_om]: "Arabic (Oman)",
  [ELanguage_Code.ar_qa]: "Arabic (Qatar)",
  [ELanguage_Code.ar_sa]: "Arabic (Saudi Arabia)",
  [ELanguage_Code.ar_sy]: "Arabic (Syria)",
  [ELanguage_Code.ar_tn]: "Arabic (Tunisia)",
  [ELanguage_Code.ar_ae]: "Arabic (U.A.E.)",
  [ELanguage_Code.ar_ye]: "Arabic (Yemen)",
  [ELanguage_Code.hy]: "Armenian",
  [ELanguage_Code.as]: "Assamese",
  [ELanguage_Code.ast]: "Asturian",
  [ELanguage_Code.az]: "Azerbaijani",
  [ELanguage_Code.eu]: "Basque",
  [ELanguage_Code.bg]: "Bulgarian",
  [ELanguage_Code.be]: "Belarusian",
  [ELanguage_Code.bn]: "Bengali",
  [ELanguage_Code.bs]: "Bosnian",
  [ELanguage_Code.br]: "Breton",
  [ELanguage_Code.my]: "Burmese",
  [ELanguage_Code.ca]: "Catalan",
  [ELanguage_Code.ch]: "Chamorro",
  [ELanguage_Code.ce]: "Chechen",
  [ELanguage_Code.zh]: "Chinese",
  [ELanguage_Code.zh_hk]: "Chinese (Hong Kong)",
  [ELanguage_Code.zh_cn]: "Chinese (PRC)",
  [ELanguage_Code.zh_sg]: "Chinese (Singapore)",
  [ELanguage_Code.zh_tw]: "Chinese (Taiwan)",
  [ELanguage_Code.cv]: "Chuvash",
  [ELanguage_Code.co]: "Corsican",
  [ELanguage_Code.cr]: "Cree",
  [ELanguage_Code.hr]: "Croatian",
  [ELanguage_Code.cs]: "Czech",
  [ELanguage_Code.da]: "Danish",
  [ELanguage_Code.nl]: "Dutch (Standard)",
  [ELanguage_Code.nl_be]: "Dutch (Belgian)",

  [ELanguage_Code.eo]: "Esperanto",
  [ELanguage_Code.et]: "Estonian",
  [ELanguage_Code.fo]: "Faeroese",
  [ELanguage_Code.fa]: "Farsi",
  [ELanguage_Code.fj]: "Fijian",
  [ELanguage_Code.fi]: "Finnish",
  [ELanguage_Code.fy]: "Frisian",
  [ELanguage_Code.fur]: "Friulian",
  [ELanguage_Code.gd]: "Gaelic (Scots)",
  [ELanguage_Code.gd_ie]: "Gaelic (Irish)",
  [ELanguage_Code.gl]: "Galacian",
  [ELanguage_Code.ka]: "Georgian",
  [ELanguage_Code.el]: "Greek",
  [ELanguage_Code.gu]: "Gujurati",
  [ELanguage_Code.ht]: "Haitian",
  [ELanguage_Code.he]: "Hebrew",
  [ELanguage_Code.hi]: "Hindi",
  [ELanguage_Code.hu]: "Hungarian",
  [ELanguage_Code.is]: "Icelandic",
  [ELanguage_Code.id]: "Indonesian",
  [ELanguage_Code.iu]: "Inuktitut",
  [ELanguage_Code.ga]: "Irish",

  [ELanguage_Code.ja]: "Japanese",
  [ELanguage_Code.kn]: "Kannada",
  [ELanguage_Code.ks]: "Kashmiri",
  [ELanguage_Code.kk]: "Kazakh",
  [ELanguage_Code.km]: "Khmer",
  [ELanguage_Code.ky]: "Kirghiz",
  [ELanguage_Code.tlh]: "Klingon",
  [ELanguage_Code.ko]: "Korean",
  [ELanguage_Code.ko_kp]: "Korean (North Korea)",
  [ELanguage_Code.ko_kr]: "Korean (South Korea)",
  [ELanguage_Code.la]: "Latin",
  [ELanguage_Code.lv]: "Latvian",
  [ELanguage_Code.lt]: "Lithuanian",
  [ELanguage_Code.lb]: "Luxembourgish",
  [ELanguage_Code.mk]: "FYRO Macedonian",
  [ELanguage_Code.ms]: "Malay",
  [ELanguage_Code.ml]: "Malayalam",
  [ELanguage_Code.mt]: "Maltese",
  [ELanguage_Code.mi]: "Maori",
  [ELanguage_Code.mr]: "Marathi",
  [ELanguage_Code.mo]: "Moldavian",
  [ELanguage_Code.nv]: "Navajo",
  [ELanguage_Code.ng]: "Ndonga",
  [ELanguage_Code.ne]: "Nepali",
  [ELanguage_Code.no]: "Norwegian",
  [ELanguage_Code.nb]: "Norwegian (Bokmal)",
  [ELanguage_Code.nn]: "Norwegian (Nynorsk)",
  [ELanguage_Code.oc]: "Occitan",
  [ELanguage_Code.or]: "Oriya",
  [ELanguage_Code.om]: "Oromo",
  [ELanguage_Code.irn]: "Persian",
  [ELanguage_Code.fa_ir]: "Persian/Iran",
  [ELanguage_Code.pl]: "Polish",
  [ELanguage_Code.pt]: "Portuguese",
  [ELanguage_Code.pt_br]: "Portuguese (Brazil)",
  [ELanguage_Code.pa]: "Punjabi",
  [ELanguage_Code.pa_in]: "Punjabi (India)",
  [ELanguage_Code.pa_pk]: "Punjabi (Pakistan)",
  [ELanguage_Code.qu]: "Quechua",
  [ELanguage_Code.rm]: "Rhaeto-Romanic",
  [ELanguage_Code.ro]: "Romanian",
  [ELanguage_Code.ro_mo]: "Romanian (Moldavia)",
  [ELanguage_Code.ru]: "Russian",
  [ELanguage_Code.ru_mo]: "Russian (Moldavia)",
  [ELanguage_Code.sz]: "Sami (Lappish)",
  [ELanguage_Code.sg]: "Sango",
  [ELanguage_Code.sa]: "Sanskrit",
  [ELanguage_Code.sc]: "Sardinian",
  [ELanguage_Code.sd]: "Sindhi",
  [ELanguage_Code.si]: "Singhalese",
  [ELanguage_Code.sr]: "Serbian",
  [ELanguage_Code.sk]: "Slovak",
  [ELanguage_Code.sl]: "Slovenian",
  [ELanguage_Code.so]: "Somani",
  [ELanguage_Code.sb]: "Sorbian",

  [ELanguage_Code.sx]: "Sutu",
  [ELanguage_Code.sw]: "Swahili",
  [ELanguage_Code.sv]: "Swedish",
  [ELanguage_Code.sv_fi]: "Swedish (Finland)",
  [ELanguage_Code.sv_sv]: "Swedish (Sweden)",
  [ELanguage_Code.ta]: "Tamil",
  [ELanguage_Code.tt]: "Tatar",
  [ELanguage_Code.te]: "Teluga",
  [ELanguage_Code.th]: "Thai",
  [ELanguage_Code.tig]: "Tigre",
  [ELanguage_Code.ts]: "Tsonga",
  [ELanguage_Code.tn]: "Tswana",
  [ELanguage_Code.tr]: "Turkish",
  [ELanguage_Code.tk]: "Turkmen",
  [ELanguage_Code.uk]: "Ukrainian",
  [ELanguage_Code.hsb]: "Upper Sorbian",
  [ELanguage_Code.ur]: "Urdu",
  [ELanguage_Code.ve]: "Venda",
  [ELanguage_Code.vi]: "Vietnamese",
  [ELanguage_Code.vo]: "Volapuk",
  [ELanguage_Code.wa]: "Walloon",
  [ELanguage_Code.cy]: "Welsh",
  [ELanguage_Code.xh]: "Xhosa",
  [ELanguage_Code.ji]: "Yiddish",
  [ELanguage_Code.zu]: "Zulu",
};
