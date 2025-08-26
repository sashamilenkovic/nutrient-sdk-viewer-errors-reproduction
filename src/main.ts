import NutrientViewer, { type Instance } from '@nutrient-sdk/viewer';

let currentInstance: Instance | null = null;

function createFreshContainer() {
  // Remove the old container if it exists
  const oldContainer = document.getElementById('test-container');
  if (oldContainer) {
    oldContainer.remove();
  }
  
  const container = document.createElement('div');
  container.id = 'test-container';
  container.style.width = '100%';
  container.style.height = '400px';
  container.style.border = '2px dashed #ccc';
  container.style.margin = '20px 0';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.color = '#666';
  
  const playground = document.querySelector('.playground');
  if (playground) {
    playground.appendChild(container);
  }
  
  return container;
}

// Simple function to load NutrientViewer with different configurations
async function loadWithConfig(config: Record<string, unknown>, scenario: string, containerSetup?: (container: HTMLElement) => void) {
  console.group(`🔥 Testing scenario: ${scenario}`);
  console.log('Configuration:', config);
  
  // Unload any existing instance first
  if (currentInstance) {
    try {
      console.log('🧹 Unloading previous instance...');
      await NutrientViewer.unload(document.getElementById('test-container')!);
      currentInstance = null;
    } catch (unloadError) {
      console.warn('Warning during unload:', unloadError);
    }
  }
  
  let containerToUse;
  
  // Handle special cases where we need to use specific containers
  if (config.container === null || typeof config.container === 'string') {
    // For null container or selector string tests, use the config as-is
    containerToUse = config.container;
  } else {
    // For all other tests, create a fresh container and apply setup
    const freshContainer = createFreshContainer();
    
    // Apply container setup if provided (for content/whitespace tests)
    if (containerSetup) {
      containerSetup(freshContainer);
    }
    
    containerToUse = freshContainer;
  }
  
  // Update config to use the determined container
  const finalConfig = { ...config, container: containerToUse } as unknown as Parameters<typeof NutrientViewer.load>[0];
  
  try {
    const instance = await NutrientViewer.load(finalConfig);
    console.log('✅ Success! NutrientViewer loaded:', instance);
    currentInstance = instance;
  } catch (error) {
    console.error('❌ Error occurred:', error);
    currentInstance = null;
  } finally {
    console.groupEnd();
  }
}

function setupPlayground() {
  // Missing container (null)
  document.getElementById('missing-container')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf',
      container: null, // This will override the fresh container
      baseUrl: window.location.origin + '/'
    }, 'Missing Container (null)');
  });

  // Incorrect selector (string that doesn't exist)
  document.getElementById('incorrect-selector')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf',
      container: '#non-existent-element', // This will override the fresh container
      baseUrl: window.location.origin + '/'
    }, 'Incorrect Selector');
  });
  
  // Container with content error
  document.getElementById('container-with-content')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf',
      baseUrl: window.location.origin + '/'
    }, 'Container with Content', (container) => {
      container.innerHTML = '<p>This container has content!</p><div>Multiple elements</div>';
    });
  });
  
  // Container with whitespace error
  document.getElementById('container-with-whitespace')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf',
      baseUrl: window.location.origin + '/'
    }, 'Container with Whitespace', (container) => {
      container.innerHTML = `   \n\t   \n   `; // Various whitespace characters
    });
  });
  
  // Container without height
  document.getElementById('container-no-height')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf',
      baseUrl: window.location.origin + '/'
    }, 'Container without Height', (container) => {
      container.innerHTML = '';
      container.style.height = '0px';
    });
  });
  
  // Missing baseUrl error
  document.getElementById('missing-baseurl')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf'
      // baseUrl intentionally missing
    }, 'Missing baseUrl');
  });
  
  // Invalid baseUrl error
  document.getElementById('invalid-baseurl')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/nutrient-web-demo.pdf',
      baseUrl: 'not-a-valid-url'
    }, 'Invalid baseUrl');
  });
  
  // Missing document error
  document.getElementById('missing-document')?.addEventListener('click', async () => {
    await loadWithConfig({
      // document intentionally missing
      baseUrl: window.location.origin + '/'
    }, 'Missing Document Path');
  });
  
  // Invalid document error
  document.getElementById('invalid-document')?.addEventListener('click', async () => {
    await loadWithConfig({
      document: '/non-existent-file.pdf',
      baseUrl: window.location.origin + '/'
    }, 'Invalid Document Path');
  });
  
  // Clear container button
  document.getElementById('clear-container')?.addEventListener('click', async () => {
    if (currentInstance) {
      try {
        console.log('🧹 Unloading current instance...');
        await NutrientViewer.unload(document.getElementById('test-container')!);
        currentInstance = null;
      } catch (unloadError) {
        console.warn('Warning during unload:', unloadError);
      }
    }
    
    const container = createFreshContainer();
    container.setAttribute('data-placeholder', 'Empty Test Container - Ready for NutrientViewer');
    console.log('🧹 Fresh empty container created and ready');
  });
  
  const initialContainer = createFreshContainer();
  initialContainer.setAttribute('data-placeholder', 'Empty Test Container - Ready for NutrientViewer');
  
  console.log('🎮 NutrientViewer Error Playground initialized!');
  console.log('📝 Click buttons to trigger different error scenarios and see them in the console.');
}

window.addEventListener('DOMContentLoaded', setupPlayground);
