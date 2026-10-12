"""
Thalir AI Model Trainer - PyTorch Transfer Learning
Train MobileNetV2 model on PlantVillage leaf dataset for high-accuracy disease classification.
"""

import os
import argparse
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms


def get_data_loaders(data_dir: str, batch_size: int = 32):
    """Set up data augmentations and data loaders for train/val split."""
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    image_datasets = {
        x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x])
        for x in ['train', 'val']
    }
    dataloaders = {
        x: torch.utils.data.DataLoader(image_datasets[x], batch_size=batch_size, shuffle=True, num_workers=4)
        for x in ['train', 'val']
    }
    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'val']}
    class_names = image_datasets['train'].classes

    return dataloaders, dataset_sizes, class_names


def build_model(num_classes: int):
    """Build MobileNetV2 with customized classification head."""
    model = models.mobilenet_v2(pretrained=True)
    # Freeze feature extractor layers
    for param in model.parameters():
        param.requires_grad = False

    # Replace classifier head
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.2),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )
    return model


def train_model(data_dir: str, num_epochs: int = 10, output_path: str = "thalir_mobilenet.pth"):
    """Execution loop for training and saving weights."""
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"[*] Training Thalir Leaf Classifier on device: {device}")

    dataloaders, dataset_sizes, class_names = get_data_loaders(data_dir)
    model = build_model(len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)

    best_acc = 0.0

    for epoch in range(num_epochs):
        print(f"Epoch {epoch+1}/{num_epochs}")
        print("-" * 20)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f"{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                torch.save(model.state_dict(), output_path)
                print(f"[+] Saved new best model checkpoint to {output_path}")

    print(f"[*] Training Complete. Best Val Accuracy: {best_acc:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Thalir Leaf Disease Classifier")
    parser.add_argument("--data-dir", type=str, default="./dataset", help="Path to dataset directory")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--output", type=str, default="thalir_mobilenet.pth", help="Output model filename")
    args = parser.parse_args()

    if os.path.exists(args.data_dir):
        train_model(args.data_dir, num_epochs=args.epochs, output_path=args.output)
    else:
        print(f"[!] Dataset directory '{args.data_dir}' not found. Please download PlantVillage dataset first.")
