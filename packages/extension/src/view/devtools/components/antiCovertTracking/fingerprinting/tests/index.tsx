/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import Fingerprinting from '..';
import {
  PSInfo,
  latestNewsXML,
  latestNewsLinks,
} from '../../../../test-data/landingPageData';

describe('Fingerprinting', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.fetch = jest.fn().mockImplementation((url: string) => {
      if (url === 'https://privacysandbox.com/rss/') {
        return Promise.resolve({
          text: jest.fn().mockResolvedValue(latestNewsXML),
        } as unknown as Response);
      }

      return Promise.resolve({
        json: jest.fn().mockResolvedValue(PSInfo),
      } as unknown as Response);
    });
  });

  it('should show Fingerprinting content', async () => {
    await act(() => render(Fingerprinting()));

    const fingerprintingContent = screen.getByTestId('fingerprinting-content');

    expect(fingerprintingContent).toBeInTheDocument();
  });

  it('Fingerprinting accordion should work', async () => {
    await act(() => render(Fingerprinting()));

    const fingerprintingContent = screen.getByTestId('fingerprinting-content');
    const buttonElement = fingerprintingContent?.querySelector(
      'button.flex.gap-2.text-2xl.font-bold.items-baseline.dark\\:text-bright-gray.cursor-pointer'
    );
    const fingerprintingFrameContainer = fingerprintingContent?.querySelector(
      'div.max-w-2xl.h-fit.flex.flex-col.gap-6.divide-y.divide-american-silver.dark\\:divide-quartz.px-4.py-6'
    );

    const fingerprintingDescription = screen.getByText(
      'User-Agent (UA) reduction minimizes the identifying information shared in the User-Agent string, which may be used for passive fingerprinting.'
    );

    const proposal = screen.getByText('Proposal');
    const proposalDescription = screen.getByText(
      'Public explanation for the proposed solution (Chrome)'
    );

    const publicDiscussion = screen.getByText('Public Discussion');
    const publicDiscussionDescription = screen.getByText(
      'Public questions and feedback about the proposal'
    );

    const devDocumentation = screen.getByText('Dev Documentation');
    const devDocumentationDescription = screen.getByText(
      'Developer documentation'
    );

    const listTitles = [proposal, publicDiscussion, devDocumentation];
    const listDescriptions = [
      proposalDescription,
      publicDiscussionDescription,
      devDocumentationDescription,
    ];
    const listDescriptionsLink: Record<string, string> = {
      'Public explanation for the proposed solution (Chrome)':
        'https://github.com/miketaylr/user-agent-reduction/',
      'Public questions and feedback about the proposal':
        'https://github.com/miketaylr/user-agent-reduction/issues',
      'Developer documentation':
        'https://developer.chrome.com/en/docs/privacy-sandbox/user-agent/',
    };

    expect(buttonElement?.textContent).toBe('User Agent Reduction');
    expect(fingerprintingFrameContainer).toBeInTheDocument();
    expect(fingerprintingFrameContainer).not.toHaveClass('hidden');

    expect(fingerprintingDescription).toBeInTheDocument();
    expect(fingerprintingDescription).toHaveClass(
      'mb-3 text-gray-700 dark:text-bright-gray text-sm'
    );

    listTitles.forEach((title) => {
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        'text-sm font-medium text-gray-900 dark:text-bright-gray truncate capitalize'
      );
    });

    listDescriptions.forEach((description) => {
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('rel', 'noreferrer');
      expect(description).toHaveAttribute(
        'href',
        listDescriptionsLink[description?.textContent ?? '']
      );
      expect(description).toHaveAttribute(
        'title',
        listDescriptionsLink[description?.textContent ?? '']
      );
      expect(description).toHaveClass(
        'text-xs text-bright-navy-blue dark:text-jordy-blue hover:opacity-80'
      );
    });

    if (buttonElement) {
      fireEvent.click(buttonElement);

      // After button is clicked.
      expect(fingerprintingFrameContainer).toHaveClass('hidden');
    }
  });

  it('should show Quick Links content', async () => {
    await act(() => render(Fingerprinting()));

    const quickLinks = screen.getByText('Quick Links');
    const reportBugLink = screen.getByText('Report a bug');
    const reportBreakageLink = screen.getByText('Report a breakage');
    const discussionsLink = screen.getByText('Join the discussions');

    expect(quickLinks).toHaveClass(
      'text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray'
    );

    // Report a bug.
    expect(reportBugLink).toHaveClass(
      'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
    );
    expect(reportBugLink).toHaveAttribute('rel', 'noreferrer');
    expect(reportBugLink).toHaveAttribute(
      'href',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=bug_report.md&title='
    );
    expect(reportBugLink).toHaveAttribute(
      'title',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=bug_report.md&title='
    );

    // Report a breakage.
    expect(reportBreakageLink).toHaveClass(
      'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
    );
    expect(reportBreakageLink).toHaveAttribute('rel', 'noreferrer');
    expect(reportBreakageLink).toHaveAttribute(
      'href',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=third-party-cookie-breakage-report.md&title='
    );
    expect(reportBreakageLink).toHaveAttribute(
      'title',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=third-party-cookie-breakage-report.md&title='
    );

    // Join the discussions.
    expect(discussionsLink).toHaveClass(
      'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
    );
    expect(discussionsLink).toHaveAttribute('rel', 'noreferrer');
    expect(discussionsLink).toHaveAttribute(
      'href',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions'
    );
    expect(discussionsLink).toHaveAttribute(
      'title',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions'
    );
  });

  it('should show Latest News content', async () => {
    await act(() => render(Fingerprinting()));

    const latestNews = screen.getByText('Latest News');
    const latestNews1 = screen.getByText(
      'Digiday survey: Why publishers are ready to end the high cost of third-party cookies and data leakage'
    );
    const latestNews2 = screen.getByText(
      'Privacy Sandbox for the Web reaches general availability'
    );
    const latestNews3 = screen.getByText(
      'How Privacy Sandbox raises the bar for ads privacy'
    );
    const latestNews4 = screen.getByText(
      'The next stages of Privacy Sandbox: General availability and supporting scaled testing'
    );
    const latestNews5 = screen.getByText(
      'Protected Audience API: Our new name for FLEDGE'
    );
    const latestNews6 = screen.getByText(
      'AdExchanger study: Cookies’ low match rates cost Ad Tech millions'
    );
    const latestNews7 = screen.getByText(
      'Working Together to Build a More Private Internet'
    );
    const latestNews8 = screen.getByText(
      'Maximize ad relevance without third-party cookies'
    );

    const lastestNewsArray = [
      latestNews1,
      latestNews2,
      latestNews3,
      latestNews4,
      latestNews5,
      latestNews6,
      latestNews7,
      latestNews8,
    ];

    expect(latestNews).toHaveClass(
      'text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray'
    );

    lastestNewsArray.forEach((element) => {
      expect(element).toHaveAttribute('rel', 'noreferrer');
      expect(element).toHaveAttribute(
        'href',
        latestNewsLinks[element?.textContent ?? '']
      );
      expect(element).toHaveClass(
        'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
      );
    });
  });

  it('should show Latest News view more button', async () => {
    await act(() => render(Fingerprinting()));

    const fingerprintingContent = screen.getByTestId('fingerprinting-content');
    const viewMoreBtn = fingerprintingContent.querySelector(
      'a.leading-6.text-sm.text-analytics.dark\\:text-medium-persian-blue.font-semibold.px-3.border.border-american-silver.dark\\:border-quartz.rounded.inline-flex.gap-2.items-center'
    );
    const viewMoreBtnInnerText = viewMoreBtn?.textContent?.trim();

    expect(viewMoreBtnInnerText).toBe('View More');
    expect(viewMoreBtn).toHaveAttribute('rel', 'noreferrer');
    expect(viewMoreBtn).toHaveAttribute(
      'href',
      'https://privacysandbox.com/news/'
    );
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
