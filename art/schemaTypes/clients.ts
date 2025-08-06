import { defineType } from 'sanity'

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    { name: 'prenom', title: 'Prenom', type: 'string' },
    { name: 'nom', title: 'Nom', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'adresse', title: 'Adresse', type: 'string' },
    { name: 'numeroTelephone', title: 'NumeroTelephone', type: 'string' },
    { name: 'pays', title: 'Pays', type: 'string' },
    { 
      name: 'region', 
      title: 'Region', 
      type: 'string',
      options: {
        list: [
          { title: 'Nord France', value: 'Nord France' },
          { title: 'Sud France', value: 'Sud France' }
        ]
      },
      initialValue: 'Nord France'
    },
  ],
  preview: {
    select: {
      title: 'prenom',
      subtitle: 'nom'
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title} ${subtitle}`
      }
    }
  }
})
