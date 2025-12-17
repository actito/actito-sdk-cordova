document.addEventListener('backbutton', handleBackButton, false);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchAssets() {
  const assetsDataContainer = document.getElementById('assetsData');
  assetsDataContainer.innerHTML = '';

  try {
    const assetGroupInput = document.getElementById('assetsGroupName');
    const assetsGroupName = assetGroupInput.value;

    const result = await ActitoAssets.fetch(assetsGroupName);
    console.log('=== Fetched assets successfully ===');
    enqueueToast('Fetched assets successfully', 'success');

    for (const asset of result) {
      const assetData = {};

      assetData.Title = asset.title;
      assetData.Description = asset.description ?? '-';
      assetData.Key = asset?.key ?? '-';
      assetData.Url = asset?.url ?? '-';
      assetData['Button Label'] = asset.button?.label ?? '-';
      assetData['Button Action'] = asset.button?.action ?? '-';
      assetData['Original File Name'] = asset.metaData?.originalFileName ?? '-';
      assetData['Content Type'] = asset.metaData?.contentType ?? '-';
      assetData['Content Length'] = asset.metaData?.contentLength ?? '-';
      assetData['Extra'] = asset.extra.length > 0 ? `${asset.extra.length} extras` : '-';

      const assetCard = document.createElement('div');
      assetCard.classList.add('card');
      assetCard.classList.add('margin-top');

      const keys = Object.keys(assetData);
      const lastKey = keys[keys.length - 1];

      for (const key of keys) {
        if (assetData.hasOwnProperty(key)) {
          const value = assetData[key];

          if (key === 'Url' && value.length > 1) {
            const attachmentRow = document.createElement('div');
            attachmentRow.classList.add('data-row');

            const labelSpan = document.createElement('span');
            labelSpan.classList.add('attachment_label');
            labelSpan.innerText = key;

            const imageElement = document.createElement('img');
            imageElement.src = value;
            imageElement.width = 96;
            imageElement.height = 64;

            attachmentRow.appendChild(labelSpan);
            attachmentRow.appendChild(imageElement);
            assetCard.appendChild(attachmentRow);
          } else {
            const dataView = `
                  <div class="data-row">
                    <span class="data-label">${key}</span>
                    <span class="data-text">${value}</span>
                  </div>
                `;

            assetCard.innerHTML += dataView;
          }

          if (key !== lastKey) {
            const divider = '<div class="divider-horizontal"></div>';
            assetCard.innerHTML += divider;
          }
        }
      }

      assetsDataContainer.appendChild(assetCard);
    }
  } catch (e) {
    console.log('=== Error fetching assets ===');
    console.log(e);

    enqueueToast('Error fetching assets.', 'error');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleAssetGroupInput(input) {
  const value = input.value;
  const searchButton = document.getElementById('assetsSearchButton');

  if (value.length > 0 && searchButton.disabled) {
    searchButton.disabled = false;
    searchButton.style.opacity = '1';
  }

  if (value.length === 0 && !searchButton.disabled) {
    searchButton.disabled = true;
    searchButton.style.opacity = '0.5';
  }
}

function handleBackButton() {
  window.location.replace('../home/home.html');
}
