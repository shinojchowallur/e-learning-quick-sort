#include <stdio.h>

/* Swap two numbers */
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/* Partition: put the pivot at its correct place, return its index */
int partition(int arr[], int low, int high) {
    int pivot = arr[high];          // last element is the pivot
    int i = low - 1;                // i = end of the "smaller" area

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {       // found a smaller element
            i++;
            swap(&arr[i], &arr[j]); // move it into the smaller area
        }
    }
    swap(&arr[i + 1], &arr[high]);  // pivot goes to its final place
    return i + 1;                   // index of the pivot
}

/* Quick Sort: sorts arr[low..high] */
void quickSort(int arr[], int low, int high) {
    if (low < high) {                       // at least 2 elements
        int p = partition(arr, low, high);  // pivot is now fixed at p
        quickSort(arr, low, p - 1);         // sort the left part
        quickSort(arr, p + 1, high);        // sort the right part
    }
}

/* Print all elements */
void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\n");
}

int main() {
    int arr[] = {8, 3, 7, 1, 5, 9, 4};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Before sorting: ");
    printArray(arr, n);

    quickSort(arr, 0, n - 1);

    printf("After sorting : ");
    printArray(arr, n);
    return 0;
}
