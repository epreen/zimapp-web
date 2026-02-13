import { type SchemaTypeDefinition } from 'sanity'
import { addressType } from './addressType'
import { authorType } from './authorType'
import { bannerType } from './bannerType'
import { blockContentType } from './blockContentType'
import { blogCategoryType } from './blogCategoryType'
import { blogType } from './blogType'
import { brandType } from './brandTypes'
import { businessApplicationType } from './businessApplicationType'
import { businessProductType } from './businessProductType'
import { categoryType } from './categoryType'
import { contactType } from './contactType'
import { couponType } from './couponType'
import { customerType } from './customerType'
import { orderType } from './orderType'
import { PersonelType } from './personelType'
import { productColorType } from './productColorType'
import { productSizeType } from './productSizeType'
import { productType } from './productType'
import { productVariantType } from './productVariantType'
import { productWeightType } from './productWeightType'
import { reviewType } from './reviewType'
import { sentNotificationType } from './sentNotificationType'
import { storeType } from './storeType'
import { subscriptionType } from './subscriptionType'
import { userAccessRequestType } from './userAccessRequestType'
import { userType } from './userType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    addressType,
    authorType,
    bannerType,
    blockContentType,
    blogCategoryType,
    blogType,
    brandType,
    businessApplicationType,
    businessProductType,
    categoryType,
    contactType,
    couponType,
    customerType,
    orderType,
    PersonelType,
    productColorType,
    productSizeType,
    productType,
    productVariantType,
    productWeightType,
    reviewType,
    sentNotificationType,
    storeType,
    subscriptionType,
    userAccessRequestType,
    userType
  ],
}
