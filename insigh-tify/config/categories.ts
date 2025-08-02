export interface AnalysisCategory {
  value: string;
  label: string;
  group: string;
  aspects: { name: string; description: string }[];
}

export const DEFAULT_CATEGORY_VALUE = 'content_quality';

export const CATEGORIES: AnalysisCategory[] = [
  {
    value: 'electronics',
    label: 'Electronics',
    group: 'Product Type Analysis',
    aspects: [
      { name: 'Performance', description: 'Speed, functionality, reliability, and battery life.' },
      { name: 'Design', description: 'Appearance, build quality, materials, and portability.' },
      { name: 'Usability', description: 'Ease of use, user interface, setup process, and software.' },
      { name: 'Value', description: 'Price-to-quality ratio, affordability, and included accessories.' },
      { name: 'Customer Service', description: 'Support experience, warranty claims, and responsiveness.' },
    ],
  },
  {
    value: 'general_products',
    label: 'General Products',
    group: 'Product Type Analysis',
    aspects: [
      { name: 'Quality', description: 'Build quality, durability, materials used, and craftsmanship.' },
      { name: 'Features', description: 'Specific product capabilities, effectiveness, and innovation.' },
      { name: 'Price/Value', description: 'Cost-effectiveness, perceived worth, and competitor comparison.' },
      { name: 'Shipping/Delivery', description: 'Speed, reliability, and condition upon arrival.' },
      { name: 'Packaging', description: 'Presentation, protection of the product, and ease of opening.' },
    ],
  },
  {
    value: 'review_source',
    label: 'Reviewer Profile Analysis',
    group: 'Reviewer Type Analysis',
    aspects: [
      { name: 'Customer Reviews', description: 'Feedback from verified purchasers, often focused on real-world use.' },
      { name: 'Expert Reviews', description: 'Feedback from industry professionals, often technical and comparative.' },
      { name: 'User Reviews', description: 'Feedback from general users (not necessarily customers), broader perspective.' },
      { name: 'Influencer Reviews', description: 'Feedback from bloggers or social media, often focused on aesthetics and brand.' },
    ],
  },
    {
    value: 'review_format',
    label: 'Review Format Analysis',
    group: 'Reviewer Type Analysis',
    aspects: [
      { name: 'Detailed Reviews', description: 'Comprehensive, in-depth feedback with pros and cons.' },
      { name: 'Brief Ratings', description: 'Short comments with star ratings, indicating overall satisfaction.' },
      { name: 'Visual Reviews', description: 'Feedback that includes photos or videos, showing real-world product state.' },
      { name: 'Comparison Reviews', description: 'Feedback that compares the product with other specific products.' },
    ],
  },
  {
    value: 'business_intelligence',
    label: 'Strategic Business Insights',
    group: 'Business Intelligence',
    aspects: [
      { name: 'Marketing and Reputation', description: 'Reviews affecting brand perception, image, and public sentiment.' },
      { name: 'Customer Experience', description: 'Reviews about service quality, support interactions, and the buying process.' },
      { name: 'Product Development', description: 'Reviews suggesting specific improvements, new features, or bug fixes.' },
      { name: 'User Profiling', description: 'Reviews that reveal information about customer segments, use cases, or demographics.' },
    ],
  },
  {
    value: DEFAULT_CATEGORY_VALUE,
    label: 'Content Quality Analysis',
    group: 'General Analysis',
    aspects: [
      { name: 'High-Quality Reviews', description: 'Detailed, informative reviews that help other customers make decisions.' },
      { name: 'Low-Quality Reviews', description: 'Brief, uninformative, or vague reviews with limited value.' },
      { name: 'Helpful vs. Unhelpful', description: 'An assessment of which feedback is most likely to be considered helpful or unhelpful by the community.' },
    ],
  },
];
