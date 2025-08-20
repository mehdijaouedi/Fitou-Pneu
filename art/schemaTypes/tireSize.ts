import { defineType } from 'sanity';

const tireSize = defineType({
  name: 'tireSize',
  title: 'Tire Size',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Size',
      type: 'string',
      description: 'Enter the tire size (e.g., 225/45R17)',
      validation: (Rule) => Rule.required().min(5).max(40),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});

export default tireSize;

