import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // TODO: Replace with your Sanity project ID
    projectId: '5dea27cf',
    dataset: 'production',
  },
})
