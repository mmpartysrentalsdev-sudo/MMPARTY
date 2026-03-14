import {defineType, defineField} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Bounce Houses', value: 'bounce-houses'},
          {title: 'Water Slides', value: 'water-slides'},
          {title: 'Combo Units', value: 'combo-units'},
          {title: 'Interactive Games', value: 'interactive-games'},
          {title: 'Tables & Chairs', value: 'tables-chairs'},
          {title: 'Concessions', value: 'concessions'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Rental price in dollars',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'e.g. 15L x 15W x 13H',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
