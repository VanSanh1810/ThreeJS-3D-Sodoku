#include <emscripten.h>
#include <stdlib.h> // Thư viện cần thiết cho srand() và rand()
#include <math.h>
#include <stdbool.h>
#include <string.h>

struct Cordinate
{
    int x;
    int y;
    int z;
};

struct Cell
{
    struct Cordinate cordinate;
    int value;
    int arrNumSelect[9];
    int indexArrNumSelect;
    bool checked;
};

// 729 and '\0'
// Complete game map
static char result[730];
// Game map
static char gameMap[730];

static struct Cell stack[729];

static int completeSodoku[9][9][9];

int nona2Deca(int x, int y, int z)
{
    int deca = x * 81 + y * 9 + z; // 9^2 + 9^1 + 9^0
    return deca;
}

static int *shuffleArray(int seed)
{
    srand(seed);
    static int arr1[9] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    // int length = sizeof(arr) / sizeof(arr[0]);

    for (int i = 8; i > 0; i--)
    {
        // Chọn một chỉ số ngẫu nhiên trong khoảng từ 0 đến i
        int j = rand() % (i + 1);

        // Hoán đổi các phần tử
        int temp = arr1[i];
        arr1[i] = arr1[j];
        arr1[j] = temp;
    }
    return arr1;
}

bool validateCell(int _x, int _y, int _z, int number)
{
    /// COMPARE BY REGION
    int centerX[2];
    centerX[0] = (_y / 3) * 3 + 1;
    centerX[1] = (_z / 3) * 3 + 1;
    int centerY[2];
    centerY[0] = (_x / 3) * 3 + 1;
    centerY[1] = (_z / 3) * 3 + 1;
    int centerZ[2];
    centerZ[0] = (_x / 3) * 3 + 1;
    centerZ[1] = (_y / 3) * 3 + 1;
    //
    // int *centerX = findNearestCenter(_y, _z);
    // int *centerY = findNearestCenter(_x, _z);
    // int *centerZ = findNearestCenter(_x, _y);
    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
            if (centerX[0] + i != _y || centerX[1] + j != _z)
            {
                int cpVal = stack[nona2Deca(_x, centerX[0] + i, centerX[1] + j)].value;
                if (cpVal == number)
                {
                    return false; // validate fail
                }
            }
            if (centerY[0] + i != _x || centerY[1] + j != _z)
            {
                int cpVal = stack[nona2Deca(centerY[0] + i, _y, centerY[1] + j)].value;
                if (cpVal == number)
                {
                    return false; // validate fail
                }
            }
            if (centerZ[0] + i != _x || centerZ[1] + j != _y)
            {
                int cpVal = stack[nona2Deca(centerZ[0] + i, centerZ[1] + j, _z)].value;
                if (cpVal == number)
                {
                    return false; // validate fail
                }
            }
        }
    }
    ///
    /// COMPARE BY AXIS
    for (int i = 0; i < 9; i++)
    {
        // Check the row (X-axis)
        if (stack[nona2Deca(i, _y, _z)].value == number)
        {
            return false; // Conflict found in the same row
        }

        // Check the column (Y-axis)
        if (stack[nona2Deca(_x, i, _z)].value == number)
        {
            return false; // Conflict found in the same column
        }

        // Check the depth (Z-axis)
        if (stack[nona2Deca(_x, _y, i)].value == number)
        {
            return false; // Conflict found in the same depth
        }
    } /// PASS
    return true;
}
//////////////////////////////////////////////////////

// int selectValidRandomCell()
// {
//     int negative_indices[729];
//     int neg_count = 0;

//     for (int i = 0; i < 729; i++)
//     {
//         if (!stack[i].checked && stack[i].value != 0)
//         {
//             negative_indices[neg_count++] = i;
//         }
//     }

//     if (neg_count == 0)
//     {
//         return -1;
//     }

//     srand(time(0));
//     int random_index = rand() % neg_count;

//     return negative_indices[random_index];
// }

// int selectNullCell()
// {
//     int negative_indices[729];
//     int neg_count = 0;

//     for (int i = 0; i < 729; i++)
//     {
//         if (!stack[i].checked && stack[i].value == 0)
//         {
//             negative_indices[neg_count++] = i;
//         }
//     }

//     if (neg_count == 0)
//     {
//         return -1;
//     }

//     srand(time(0));
//     int random_index = rand() % neg_count;

//     return negative_indices[random_index];
// }

// bool isHaveOneSolution()
// {
//     int solution = 0;
// }

// void gradualDrop(int targetEmpty)
// {
//     int countCellDrop = 0;
//     while (targetEmpty > countCellDrop)
//     {
//         int cellSelected = selectValidRandomCell();
//         if (cellSelected == -1)
//         {
//             break;
//         }
//         int rollBackNum = stack[cellSelected].value;
//         stack[cellSelected].value = 0;
//         if (isHaveOneSolution())
//         {
//             countCellDrop++;
//         }
//         else
//         {
//             stack[cellSelected].value = rollBackNum;
//             stack[cellSelected].checked = true;
//         }
//     }
// }

EMSCRIPTEN_KEEPALIVE
char *getSodoku(int seed, int targetEmpty) // easy 100 cell , medium 200 cell, hard 400 cell
{
    // init result
    for (int i = 0; i < 730; i++)
    {
        result[i] = '0';
    }
    result[729] = '\0';

    int *selectionArr = shuffleArray(seed);
    // init map and stack
    for (int x = 0; x < 9; x++)
    {
        for (int y = 0; y < 9; y++)
        {
            for (int z = 0; z < 9; z++)
            {
                int stackIndex = nona2Deca(x, y, z);
                stack[stackIndex].cordinate.x = x;
                stack[stackIndex].cordinate.y = y;
                stack[stackIndex].cordinate.z = z;
                stack[stackIndex].value = 0;
                for (int i = 0; i < 9; i++)
                {
                    stack[stackIndex].arrNumSelect[i] = selectionArr[i];
                }
                stack[stackIndex].indexArrNumSelect = -1;
                stack[stackIndex].checked = false;
            }
        }
    }
    //
    int _index = 0;
    while (1)
    {
        if (_index == 729 || _index < 0)
        {
            break;
        }
        int k = stack[_index].indexArrNumSelect;
        if (k == 8)
        {
            stack[_index].value = 0;
            stack[_index].indexArrNumSelect = -1;
            _index--;
            continue;
        }
        bool isFound = false;
        for (int i = k + 1; i < 9; i++)
        {
            if (validateCell(stack[_index].cordinate.x, stack[_index].cordinate.y, stack[_index].cordinate.z, stack[_index].arrNumSelect[i]))
            {
                stack[_index].value = stack[_index].arrNumSelect[i];
                stack[_index].indexArrNumSelect = i;
                isFound = true;
                break;
            }
        }
        if (isFound)
        {
            _index++;
        }
        else
        {
            stack[_index].value = 0;
            stack[_index].indexArrNumSelect = -1;
            _index--;
        }
    }

    for (int i = 0; i < 729; i++)
    {
        result[i] = stack[i].value + '0';
        completeSodoku[stack[i].cordinate.x][stack[i].cordinate.y][stack[i].cordinate.z] = stack[i].value;
    }

    result[729] = '\0';

    return result;
}

EMSCRIPTEN_KEEPALIVE
int validatePuzzle(char *table)
{
    for (int i = 0; i < strlen(table); i++)
    {
        if (!validateCell(stack[i].cordinate.x, stack[i].cordinate.y, stack[i].cordinate.z, atoi(table[i])))
        {
            return -1;
        }
    }
    return 1;
}
