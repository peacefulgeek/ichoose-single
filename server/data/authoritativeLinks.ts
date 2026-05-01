/**
 * Authoritative external links for E-E-A-T citations. Per master scope §14B,
 * every article must link to at least one of these.
 */
export interface AuthoritativeLink {
  url: string;
  anchor: string;
}

export const AUTHORITATIVE_LINKS: AuthoritativeLink[] = [
  { url: "https://www.psychologytoday.com/us/basics/single-life", anchor: "Psychology Today's coverage of single life" },
  { url: "https://www.apa.org/topics/families/single-life", anchor: "the American Psychological Association" },
  { url: "https://pubmed.ncbi.nlm.nih.gov/?term=single+living+well-being", anchor: "peer-reviewed research on single-living and well-being" },
  { url: "https://www.cdc.gov/healthyplaces/healthtopics/social_isolation.htm", anchor: "the CDC's research on social isolation" },
  { url: "https://www.who.int/teams/social-determinants-of-health/demographic-change-and-healthy-ageing/social-isolation-and-loneliness", anchor: "the World Health Organization on isolation and loneliness" },
  { url: "https://www.nih.gov/news-events/news-releases/social-isolation-loneliness-older-people-pose-health-risks", anchor: "the National Institutes of Health" },
  { url: "https://hbr.org/2019/03/the-research-is-clear-long-hours-backfire-for-people-and-for-companies", anchor: "Harvard Business Review's reporting" },
  { url: "https://www.pewresearch.org/social-trends/2020/08/20/a-profile-of-single-americans/", anchor: "Pew Research Center's profile of single Americans" },
];
