/**
 * ─────────────────────────────────────────────────────────────
 *  TOUTES LES INFORMATIONS DU MARIAGE SONT ICI.
 *  Modifiez ce fichier pour changer noms, dates, lieux et textes.
 * ─────────────────────────────────────────────────────────────
 *
 *  Valeur `null` = information inconnue pour l'instant :
 *  elle n'est simplement pas affichée sur le site.
 */

export const weddingData = {
  couple: {
    groom: { firstName: 'Ibrahim', fullName: 'Ibrahim Dembélé' },
    bride: { firstName: 'Fatoumata', fullName: 'Fatoumata Diarra' },
    /** Prénoms affichés en grand */
    displayName: 'Ibrahim & Fatoumata',
    /** Affiché sous les prénoms */
    coupleLabel: 'Couple Dembélé',
    monogram: 'I & F',
  },

  /**
   * Décalage horaire de Bamako (Africa/Bamako) : UTC+0, sans heure d'été.
   * Utilisé par le compte à rebours.
   */
  utcOffset: '+00:00',

  /** Dates au format AAAA-MM-JJ ; le jour de la semaine est calculé automatiquement. */
  civilCeremony: {
    date: '2026-12-15',
    title: 'La mairie',
    description: 'Cérémonie civile',
    startTime: null, // À compléter, ex. '10:00'
    location: null, // À compléter, ex. 'Mairie de …'
  },

  wedding: {
    date: '2026-12-20',
    title: 'La célébration du mariage',
    /** Heure de début (HH:MM). Il n'y a volontairement pas d'heure de fin. */
    startTime: '08:00',
    location: 'Diélibougou',
  },

  locations: [
    {
      id: 'bride',
      title: 'Chez la mariée',
      mapsUrl: 'https://maps.app.goo.gl/FRRZXjvXxe9wRSzK8?g_st=ic',
    },
    {
      id: 'groom',
      title: 'Chez le marié',
      mapsUrl: 'https://maps.app.goo.gl/y4XQeyxTkZHASfG26?g_st=aw',
    },
  ],

  rsvp: {
    deadline: null, // À compléter, ex. « avant le 1er décembre 2026 »
    maxGuests: 10,
  },

  /**
   * Photos : le nom correspond au fichier placé dans /photos (sans extension).
   * Après tout ajout/remplacement, lancez `npm run photos`.
   */
  photos: {
    hero: 'portrait-rose',
    love: 'portrait-tendre',
    final: 'portrait-gris',
    gallery: ['portrait-rose', 'portrait-tendre', 'portrait-gris'],
    alt: {
      'portrait-rose': 'Ibrahim et Fatoumata debout côte à côte devant un fond rose poudré.',
      'portrait-tendre':
        "Ibrahim et Fatoumata assis l'un contre l'autre, la main de Fatoumata posée sur l'épaule d'Ibrahim.",
      'portrait-gris': 'Ibrahim et Fatoumata côte à côte, souriants, devant un fond gris.',
    },
  },

  /** Tous les textes du site. */
  text: {
    /** Tout premier écran, avant l'enveloppe. */
    welcome: {
      eyebrow: 'Bienvenue',
      title: 'Bienvenue dans cette aventure',
      message:
        'Vous vous apprêtez à vivre un moment unique à nos côtés. Laissez-vous guider : une belle histoire vous attend…',
      start: "Commencer l'aventure",
    },
    envelope: {
      tagline: 'Deux cœurs, une histoire, un nouveau chapitre…',
      invited: 'Vous êtes invité(e)s',
      open: "Ouvrir l'enveloppe",
      cardLabel: 'Invitation',
    },
    hero: {
      eyebrow: 'Invitation au mariage',
      intro: 'ont la joie de vous convier à célébrer leur union',
      scroll: 'Découvrir',
    },
    countdown: {
      eyebrow: 'Le compte à rebours',
      title: 'Avant le grand jour',
      done: 'Le grand jour est arrivé.',
      doneSubtitle: 'Merci de célébrer cette journée avec nous.',
    },
    dates: {
      eyebrow: 'Le programme',
      title: 'Deux dates, une même célébration',
      intro: 'Notre union se célèbre en deux temps. Retenez bien ces deux dates.',
    },
    love: {
      eyebrow: 'Un nouveau chapitre',
      quote: "Deux chemins qui se rencontrent, deux cœurs qui choisissent d'avancer ensemble…",
      paragraphs: [
        "Il est des rencontres qui donnent un sens nouveau à chaque jour. Aujourd'hui, avec gratitude et sérénité, nous choisissons d'unir nos vies et d'écrire ensemble la suite de notre histoire.",
        'Ce bonheur ne serait pas complet sans ceux qui nous sont chers. Votre présence à nos côtés donnera à ce jour toute sa lumière.',
      ],
    },
    gallery: {
      eyebrow: 'Galerie',
      title: 'Quelques instants',
    },
    details: {
      eyebrow: 'Informations pratiques',
      title: 'Le jour J',
      locationsTitle: 'Les lieux',
      locationsIntro: "Retrouvez l'itinéraire vers chacun des deux foyers.",
      mapButton: "Voir l'itinéraire",
    },
    rsvp: {
      eyebrow: 'Confirmation',
      title: 'Votre présence rendra cette journée encore plus belle.',
      intro: 'Merci de nous confirmer votre présence.',
      submit: 'Je serai présent(e)',
      submitting: 'Envoi en cours…',
    },
    confirmation: {
      title: 'Merci !',
      message: 'Nous avons hâte de partager cette belle journée avec vous.',
    },
    final: {
      message: 'Merci de faire partie de ce moment précieux.',
    },
    footer: {
      note: 'Avec toute notre affection',
    },
  },
}
