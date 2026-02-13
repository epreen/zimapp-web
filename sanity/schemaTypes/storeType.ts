import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const storeType = defineType({
  name: 'store',
  title: 'Store',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Store Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Store Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'house',
          title: 'House/Building Number',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string',
        },
        {
          name: 'zipCode',
          title: 'ZIP/Postal Code',
          type: 'string',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: (Rule) => Rule.required(),
          options: {
            list: [
              {title: 'Malawi', value: 'MW'},
              {title: 'Zambia', value: 'ZA'},
              {title: 'Tanzania', value: 'TZ'},
              {title: 'Mozambique', value: 'MZ'},
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Location Coordinates',
      type: 'object',
      description: 'GPS coordinates for map display',
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required().min(-90).max(90),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required().min(-180).max(180),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hours',
      title: 'Opening Hours',
      type: 'object',
      fields: [
        {
          name: 'monday',
          title: 'Monday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
        {
          name: 'tuesday',
          title: 'Tuesday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
        {
          name: 'wednesday',
          title: 'Wednesday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
        {
          name: 'thursday',
          title: 'Thursday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
        {
          name: 'friday',
          title: 'Friday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
        {
          name: 'saturday',
          title: 'Saturday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
        {
          name: 'sunday',
          title: 'Sunday',
          type: 'object',
          fields: [
            {name: 'open', title: 'Opening Time', type: 'string'},
            {name: 'close', title: 'Closing Time', type: 'string'},
            {name: 'closed', title: 'Closed', type: 'boolean'},
          ],
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Store Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'Store Features',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Parking Available', value: 'parking'},
          {title: 'WiFi', value: 'wifi'},
          {title: 'Wheelchair Accessible', value: 'wheelchair'},
          {title: 'Pet Friendly', value: 'petFriendly'},
          {title: 'Drive-Through', value: 'driveThrough'},
          {title: 'Curbside Pickup', value: 'curbside'},
          {title: 'Organic Products', value: 'organic'},
          {title: 'Freshly Baked Goods', value: 'bakery'},
          {title: 'Deli Counter', value: 'deli'},
          {title: 'Pharmacy', value: 'pharmacy'},
          {title: 'Local Store', value: 'local'},
        ],
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Store Active',
      type: 'boolean',
      description: 'Is this store currently operational?',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first in listings',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'address.city',
      country: 'address.country',
      media: 'image',
    },
    prepare(selection) {
      const {title, subtitle, country} = selection
      return {
        ...selection,
        subtitle: subtitle ? `${subtitle}, ${country}` : country,
      }
    },
  },
})