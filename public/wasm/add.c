#include <emscripten.h>
#include <stdlib.h> // Thư viện cần thiết cho srand() và rand()
#include <math.h>

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
};

// 729 and '\0'
static char result[730];
// sodoku cell map
static struct Cell sodoku[9][9][9];

static struct Cell stack[729];

int nona2Deca(int x, int y, int z)
{
    int deca = x * 81 + y * 9 + z; // 9^2 + 9^1 + 9^0
    return deca;
}

static int *shuffleArray(int seed)
{
    srand(seed);
    static int arr[9] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    // int length = sizeof(arr) / sizeof(arr[0]);

    for (int i = 8; i > 0; i--)
    {
        // Chọn một chỉ số ngẫu nhiên trong khoảng từ 0 đến i
        int j = rand() % (i + 1);

        // Hoán đổi các phần tử
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

static int *findNearestCenter(int x, int y)
{
    static int arr[2];

    int rowCenter = (x / 3) * 3 + 1;
    int colCenter = (y / 3) * 3 + 1;

    // Nếu tọa độ (x, y) đã là trung tâm, trả về chính nó
    if (x == rowCenter && y == colCenter)
    {
        arr[0] = x;
        arr[1] = y;
    }
    else
    {
        // Trả về tọa độ trung tâm gần nhất
        arr[0] = rowCenter;
        arr[1] = colCenter;
    }

    return arr;
}

bool validateCell(int _x, int _y, int _z, int number)
{
    /// COMPARE BY REGION
    // X
    int *centerX = findNearestCenter(_y, _z);
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
        }
    }
    // Y
    int *centerY = findNearestCenter(_x, _z);
    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
            if (centerY[0] + i != _x || centerY[1] + j != _z)
            {
                int cpVal = stack[nona2Deca(centerY[0] + i, _y, centerY[1] + j)].value;
                if (cpVal == number)
                {
                    return false; // validate fail
                }
            }
        }
    }
    // Z
    int *centerZ = findNearestCenter(_x, _y);
    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
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
    //
    ///
    /// COMPARE BY AXIS
    // X
    for (int x = 0; x < 9; x++)
    {
        if (x != _x)
        {
            int cpVal = stack[nona2Deca(x, _y, _z)].value;
            if (cpVal == number)
            {
                return false; // validate fail
            }
        }
    }
    // Y
    for (int y = 0; y < 9; y++)
    {
        if (y != _y)
        {
            int cpVal = stack[nona2Deca(_x, y, _z)].value;
            if (cpVal == number)
            {
                return false; // validate fail
            }
        }
    }
    // Z
    for (int z = 0; z < 9; z++)
    {
        if (z != _z)
        {
            int cpVal = stack[nona2Deca(_x, _y, z)].value;
            if (cpVal == number)
            {
                return false; // validate fail
            }
        }
    }
    /// PASS
    return true;
}

EMSCRIPTEN_KEEPALIVE
char *getSodoku(int seed)
{
    // Đặt seed cho hàm sinh số ngẫu nhiên
    srand(seed);
    // init result
    for (int i = 0; i < 730; i++)
    {
        result[i] = '0';
    }
    result[729] = '\0';

    // init map and stack
    for (int x = 0; x < 9; x++)
    {
        for (int y = 0; y < 9; y++)
        {
            for (int z = 0; z < 9; z++)
            {
                int *selectionArr = shuffleArray(seed);
                // push to sodoku
                // sodoku[x][y][z].cordinate.x = x;
                // sodoku[x][y][z].cordinate.y = y;
                // sodoku[x][y][z].cordinate.z = z;
                // sodoku[x][y][z].value = 0;
                // for (int i = 0; i < 9; i++)
                // {
                //     sodoku[x][y][z].arrNumSelect[i] = selectionArr[i];
                // }
                // sodoku[x][y][z].indexArrNumSelect = -1;
                // push to stack
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
            }
        }
    }
    //
    int count = 0;
    int _index = 0;
    while (1)
    {
        if (_index == 729)
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

    return result;
}