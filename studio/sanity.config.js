import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'mmparty-rentals',
  title: 'M&M Partys Rentals',

  // TODO: Replace with your Sanity project ID after running: npx sanity init
  projectId: '5dea27cf',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
