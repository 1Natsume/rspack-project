// utils/webScraper.ts
export interface ScrapingConfig {
  url: string;
  selector: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ScrapingResult {
  success: boolean;
  data: string | null|NodeListOf<Element>;
  error?: string;
  timestamp: Date;
}

class WebScraper {
  private async fetchWithTimeout(url: string, timeout: number = 10000, headers: Record<string, string> = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private parseHTML(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }

  private extractData(document: Document, selector: string): string | null {
    const element = document.querySelector(selector);
    
    if (!element) {
      return null;
    }

    // 根据元素类型返回不同的数据
    if (element instanceof HTMLInputElement) {
      return element.value;
    } else if (element instanceof HTMLSelectElement) {
      return element.value;
    } else if (element instanceof HTMLImageElement) {
      return element.src;
    } else if (element instanceof HTMLAnchorElement) {
      return element.href;
    } else {
      return element.textContent?.trim() || element.innerHTML.trim();
    }
  }

  public extractDatas(document: Document, selector: string) {
    const element = document.querySelectorAll(selector);
    
    if (!element) {
      return null;
    }

    return element
  };

  public async scrapeElement(config: ScrapingConfig): Promise<ScrapingResult> {
    const result: ScrapingResult = {
      success: false,
      data: null,
      timestamp: new Date(),
    };

    try {
      // 验证输入
      if (!config.url || !config.selector) {
        throw new Error('URL和选择器是必需的');
      }

      // 发送请求
      const response = await this.fetchWithTimeout(
        config.url, 
        config.timeout, 
        config.headers
      );

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      // 获取HTML内容
      const html = await response.text();
      
      // 解析HTML
      const document = this.parseHTML(html);
      
      // 提取数据
      const data = this.extractData(document, config.selector);
      
      if (data === null) {
        throw new Error(`未找到选择器 "${config.selector}" 对应的元素`);
      }

      result.success = true;
      result.data = data;

    } catch (error) {
      result.error = error instanceof Error ? error.message : '未知错误';
    }

    return result;
  }

  public async scrapeGetElements(config: ScrapingConfig) {
    try {
      // 验证输入
      if (!config.url || !config.selector) {
        throw new Error('URL和选择器是必需的');
      }

      // 发送请求
      const response = await this.fetchWithTimeout(
        config.url, 
        config.timeout, 
        config.headers
      );

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      // 获取HTML内容
      const html = await response.text();
      
      // 解析HTML
      const document = this.parseHTML(html);
      
      // 提取数据
      const data = this.extractDatas(document, config.selector);
      
      if (data === null) {
        throw new Error(`未找到选择器 "${config.selector}" 对应的元素`);
      }

      
      return data;

    } catch (error) {
      // result.error = error instanceof Error ? error.message : '未知错误';
    }
  }

  // 批量获取多个元素
  public async scrapeMultipleElements(
    url: string, 
    selectors: string[], 
    timeout?: number
  ): Promise<Record<string, ScrapingResult>> {
    const results: Record<string, ScrapingResult> = {};

    for (const selector of selectors) {
      results[selector] = await this.scrapeElement({
        url,
        selector,
        timeout,
      });
    }

    return results;
  }

  public async scrapeElements(
    url: string, 
    selector: string, 
    timeout?: number
  ) {
     const data = await this.scrapeGetElements({
        url,
        selector,
        timeout,
      });
    

    return data;
  }

  public async scrapeHtml(url: string, ){
    // 发送请求
      const response = await this.fetchWithTimeout(
        url, 
      );

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      // 获取HTML内容
      const html = await response.text();
      
      // 解析HTML
      const document = this.parseHTML(html);
      return document
  }

  // 获取元素属性
  public async scrapeAttribute(
    config: ScrapingConfig & { attribute: string }
  ): Promise<ScrapingResult> {
    const baseResult = await this.scrapeElement(config);
    
    if (baseResult.success && baseResult.data) {
      try {
        const html = baseResult.data;
        const document = this.parseHTML(`<div>${html}</div>`);
        const element = document.querySelector(config.selector);
        
        if (element && element.hasAttribute(config.attribute)) {
          baseResult.data = element.getAttribute(config.attribute);
        } else {
          baseResult.success = false;
          baseResult.data = null;
          baseResult.error = `元素没有属性 "${config.attribute}"`;
        }
      } catch (error) {
        baseResult.success = false;
        baseResult.data = null;
        baseResult.error = '解析属性时出错';
      }
    }

    return baseResult;
  }
}

export const webScraper = new WebScraper();