-- Widen orders.country from just ('AE', 'EG') to the full Arab League
-- roster. Every one of these except Egypt pays via the same UAE Stripe
-- account in AED; only Egypt keeps the InstaPay path, so currency stays
-- restricted to ('AED', 'EGP') unchanged.
alter table orders drop constraint orders_country_check;
alter table orders add constraint orders_country_check check (
  country in (
    'AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 'IQ', 'SY', 'YE',
    'SD', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SO', 'DJ', 'KM', 'PS', 'EG'
  )
);
