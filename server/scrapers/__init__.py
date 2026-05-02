from .hn import scrape_hn
from .github import scrape_github
from .devto import scrape_devto
from .reddit import scrape_reddit

def scrape_all():
    all_results = []
    all_results.extend(scrape_hn())
    all_results.extend(scrape_github())
    all_results.extend(scrape_devto())
    all_results.extend(scrape_reddit())
    return all_results
